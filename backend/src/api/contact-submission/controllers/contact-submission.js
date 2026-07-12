'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 6;
const RATE_LIMIT_MAP = new Map();
const INQUIRY_TYPES = ['General', 'Support', 'Partnership', 'Feedback'];
const EMAIL_STATUS = {
    SENT: 'sent',
    FAILED: 'failed',
    PENDING: 'pending',
};

const normalize = (value) => {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim().replace(/\s+/g, ' ');
};

const escapeHtml = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const hasHeaderInjection = (value) => {
    return typeof value === 'string' && /[\r\n]/.test(value);
};

const isValidEmail = (value) => {
    if (typeof value !== 'string' || value.length > 254) {
        return false;
    }

    const normalized = value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(normalized);
};

const isValidPhone = (value) => {
    if (typeof value !== 'string' || value.length < 7 || value.length > 30) {
        return false;
    }

    const normalized = value.trim();
    return /^[+0-9().\s-]+$/.test(normalized);
};

const generateReference = () => {
    return `CS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

const getClientIp = (ctx) => {
    return ctx.request.ip || ctx.ip || ctx.request.header['x-real-ip'] || 'unknown';
};

const trackRateLimit = (ip) => {
    const now = Date.now();
    const attempts = RATE_LIMIT_MAP.get(ip) || [];
    const windowed = attempts.filter((timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS);
    windowed.push(now);
    RATE_LIMIT_MAP.set(ip, windowed);
    return windowed.length;
};

const buildFromAddress = () => {
    const fromEmail = process.env.EMAIL_FROM_ADDRESS;
    const fromName = process.env.EMAIL_FROM_NAME || 'Website Team';

    if (!fromEmail) {
        throw new Error('EMAIL_FROM_ADDRESS is not configured.');
    }

    return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
};

const buildAdminEmailHtml = ({ submission }) => {
    return `
    <div style="font-family:system-ui, sans-serif; color:#111; line-height:1.5;">
      <h2 style="margin:0 0 16px; font-size:20px;">New Contact Submission Received</h2>
      <p style="margin:0 0 16px;">A new contact form submission was received.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <tr><td style="font-weight:600; padding:8px 0; width:130px;">Reference</td><td style="padding:8px 0;">${escapeHtml(submission.publicReference)}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Name</td><td style="padding:8px 0;">${escapeHtml(submission.fullName)}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Email</td><td style="padding:8px 0;">${escapeHtml(submission.email)}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Phone</td><td style="padding:8px 0;">${escapeHtml(submission.phone || 'Not provided')}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Subject</td><td style="padding:8px 0;">${escapeHtml(submission.subject)}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Inquiry Type</td><td style="padding:8px 0;">${escapeHtml(submission.inquiryType || 'General')}</td></tr>
        <tr><td style="font-weight:600; padding:8px 0;">Received</td><td style="padding:8px 0;">${escapeHtml(new Date(submission.createdAt).toISOString())}</td></tr>
      </table>
      <div style="margin-top:16px; padding:14px; background:#f8f9fb; border:1px solid #e5e7eb; border-radius:8px;">
        <p style="margin:0 0 8px; font-weight:600;">Message</p>
        <p style="margin:0; white-space:pre-wrap;">${escapeHtml(submission.message)}</p>
      </div>
    </div>
  `;
};

const buildAdminEmailText = ({ submission }) => {
    return `New contact submission received.

Reference: ${submission.publicReference}
Name: ${submission.fullName}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Subject: ${submission.subject}
Inquiry Type: ${submission.inquiryType || 'General'}
Received: ${new Date(submission.createdAt).toISOString()}

Message:
${submission.message}
`;
};

const buildUserEmailHtml = ({ submission }) => {
    return `
    <div style="font-family:system-ui, sans-serif; color:#111; line-height:1.6;">
      <h2 style="margin:0 0 16px; font-size:20px;">Thank you for contacting us</h2>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(submission.fullName)},</p>
      <p style="margin:0 0 16px;">We have received your message about <strong>${escapeHtml(submission.subject)}</strong>. Your submission reference is <strong>${escapeHtml(submission.publicReference)}</strong>.</p>
      <p style="margin:0 0 16px;">We will review your inquiry and follow up as soon as possible.</p>
      <p style="margin:0 0 16px;">If you need to contact us again, reply to this email or visit our website.</p>
      <p style="margin:0;">Thanks,<br/>${escapeHtml(process.env.EMAIL_FROM_NAME || 'The team')}</p>
    </div>
  `;
};

const buildUserEmailText = ({ submission }) => {
    return `Thank you for contacting us, ${submission.fullName}.

We received your message about: ${submission.subject}
Reference: ${submission.publicReference}

We will review your inquiry and follow up as soon as possible.

Thanks,
${process.env.EMAIL_FROM_NAME || 'The team'}
`;
};

module.exports = createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
    async submit(ctx) {
        const body = ctx.request.body || {};
        const clientIp = getClientIp(ctx);

        if (typeof body !== 'object') {
            ctx.status = 400;
            return (ctx.body = { success: false, message: 'Invalid request payload.' });
        }

        const honeypot = normalize(body.homepage || body.honeypot);
        if (honeypot) {
            ctx.status = 400;
            return (ctx.body = { success: false, message: 'Invalid submission.' });
        }

        const fullName = normalize(body.fullName);
        const email = normalize(body.email);
        const phone = normalize(body.phone);
        const subject = normalize(body.subject);
        const inquiryType = normalize(body.inquiryType);
        const message = normalize(body.message);

        const errors = {};

        if (!fullName || fullName.length < 2 || fullName.length > 100) {
            errors.fullName = 'Please enter your full name (2 to 100 characters).';
        }

        if (!email || !isValidEmail(email) || hasHeaderInjection(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (phone && !isValidPhone(phone)) {
            errors.phone = 'Please enter a valid phone number or leave the field empty.';
        }

        if (!subject || subject.length < 3 || subject.length > 150 || hasHeaderInjection(subject)) {
            errors.subject = 'Please enter a subject between 3 and 150 characters.';
        }

        if (inquiryType && !INQUIRY_TYPES.includes(inquiryType)) {
            errors.inquiryType = 'Please select a valid inquiry type.';
        }

        if (!message || message.length < 10 || message.length > 2000) {
            errors.message = 'Please enter a message between 10 and 2000 characters.';
        }

        if (Object.keys(errors).length > 0) {
            ctx.status = 422;
            return (ctx.body = {
                success: false,
                message: 'Please correct the highlighted fields.',
                errors,
            });
        }

        const requestCount = trackRateLimit(clientIp);
        if (requestCount > RATE_LIMIT_MAX) {
            ctx.status = 429;
            return (ctx.body = {
                success: false,
                message: 'Too many requests. Please try again later.',
            });
        }

        const publicReference = generateReference();

        let submission;

        try {
            submission = await strapi.entityService.create('api::contact-submission.contact-submission', {
                data: {
                    fullName,
                    email,
                    phone: phone || null,
                    subject,
                    inquiryType: inquiryType || null,
                    message,
                    status: 'new',
                    adminEmailStatus: EMAIL_STATUS.PENDING,
                    userEmailStatus: EMAIL_STATUS.PENDING,
                    publicReference,
                },
            });
        } catch (error) {
            strapi.log.error('Contact submission save failed:', error);
            ctx.status = 500;
            return (ctx.body = { success: false, message: 'Something went wrong. Please try again later.' });
        }

        let resend = null;
        try {
            const { Resend } = require('resend');
            resend = new Resend(process.env.RESEND_API_KEY);
        } catch (error) {
            strapi.log.warn('Resend package is not installed or could not be loaded. Email sending is disabled.', error.message);
        }

        const fromAddress = (() => {
            try {
                return buildFromAddress();
            } catch (error) {
                strapi.log.error('Email sender configuration error:', error.message);
                return null;
            }
        })();

        const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL;

        let adminEmailStatus = EMAIL_STATUS.PENDING;
        let userEmailStatus = EMAIL_STATUS.PENDING;

        if (resend && fromAddress && adminRecipient) {
            try {
                await resend.emails.send({
                    from: fromAddress,
                    to: adminRecipient,
                    subject: `New contact submission: ${subject}`,
                    html: buildAdminEmailHtml({ submission }),
                    text: buildAdminEmailText({ submission }),
                    reply_to: email,
                });
                adminEmailStatus = EMAIL_STATUS.SENT;
            } catch (error) {
                adminEmailStatus = EMAIL_STATUS.FAILED;
                strapi.log.error('Admin notification email failed:', error);
            }
        } else {
            adminEmailStatus = EMAIL_STATUS.FAILED;
            strapi.log.warn('Admin notification email skipped because email configuration is incomplete.');
        }

        if (resend && fromAddress && isValidEmail(email)) {
            try {
                await resend.emails.send({
                    from: fromAddress,
                    to: email,
                    subject: 'We received your message',
                    html: buildUserEmailHtml({ submission }),
                    text: buildUserEmailText({ submission }),
                });
                userEmailStatus = EMAIL_STATUS.SENT;
            } catch (error) {
                userEmailStatus = EMAIL_STATUS.FAILED;
                strapi.log.error('User confirmation email failed:', error);
            }
        } else {
            userEmailStatus = EMAIL_STATUS.FAILED;
            strapi.log.warn('User confirmation email skipped because email configuration is incomplete.');
        }

        try {
            await strapi.entityService.update('api::contact-submission.contact-submission', submission.id, {
                data: {
                    adminEmailStatus,
                    userEmailStatus,
                },
            });
        } catch (error) {
            strapi.log.error('Failed to update email status on contact submission:', error);
        }

        return (ctx.body = {
            success: true,
            message: 'Your message has been received successfully.',
            data: {
                reference: submission.publicReference,
            },
        });
    },
}));
