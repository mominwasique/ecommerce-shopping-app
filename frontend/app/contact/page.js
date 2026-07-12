"use client"

import * as React from 'react'
import contactInfo from '@/lib/contactInfo'

const inquiryOptions = [
    { value: 'General', label: 'General inquiry' },
    { value: 'Support', label: 'Support request' },
    { value: 'Partnership', label: 'Partnership inquiry' },
    { value: 'Feedback', label: 'Feedback' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+0-9().\s-]{7,30}$/

const contactUs = () => {
    const [form, setForm] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        inquiryType: 'General',
        message: '',
        homepage: '',
    })
    const [errors, setErrors] = React.useState({})
    const [status, setStatus] = React.useState('idle')
    const [statusMessage, setStatusMessage] = React.useState('')
    const [reference, setReference] = React.useState('')

    const isSubmitting = status === 'submitting'

    const validateFields = () => {
        const nextErrors = {}

        if (!form.fullName.trim() || form.fullName.trim().length < 2 || form.fullName.trim().length > 100) {
            nextErrors.fullName = 'Please enter your full name (2–100 characters).'
        }

        if (!form.email.trim() || !emailPattern.test(form.email.trim()) || form.email.includes('\n') || form.email.includes('\r')) {
            nextErrors.email = 'Please enter a valid email address.'
        }

        if (form.phone.trim() && !phonePattern.test(form.phone.trim())) {
            nextErrors.phone = 'Please enter a valid phone number or leave it blank.'
        }

        if (!form.subject.trim() || form.subject.trim().length < 3 || form.subject.trim().length > 150) {
            nextErrors.subject = 'Please enter a subject between 3 and 150 characters.'
        }

        if (!form.message.trim() || form.message.trim().length < 10 || form.message.trim().length > 2000) {
            nextErrors.message = 'Please enter a message between 10 and 2000 characters.'
        }

        if (form.inquiryType && !inquiryOptions.some((option) => option.value === form.inquiryType)) {
            nextErrors.inquiryType = 'Please choose a valid inquiry type.'
        }

        return nextErrors
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isSubmitting) {
            return
        }

        setStatus('idle')
        setStatusMessage('')
        setReference('')

        const nextErrors = validateFields()
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            setStatus('error')
            setStatusMessage('Please correct the highlighted fields.')
            return
        }

        if (form.homepage.trim()) {
            setStatus('error')
            setStatusMessage('Invalid submission.')
            return
        }

        setErrors({})
        setStatus('submitting')

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/contact/submit`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: form.fullName.trim(),
                        email: form.email.trim(),
                        phone: form.phone.trim(),
                        subject: form.subject.trim(),
                        inquiryType: form.inquiryType,
                        message: form.message.trim(),
                        homepage: form.homepage,
                    }),
                }
            )

            const result = await response.json()

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    setErrors(result.errors)
                    setStatusMessage(result.message || 'Please correct the highlighted fields.')
                } else if (response.status === 429) {
                    setStatusMessage(result.message || 'Too many requests. Please try again later.')
                } else {
                    setStatusMessage(result.message || 'Something went wrong. Please try again later.')
                }
                setStatus('error')
                return
            }

            setStatus('success')
            setStatusMessage(result.message || 'Your message has been received successfully.')
            setReference(result.data?.reference || '')
            setForm({ fullName: '', email: '', phone: '', subject: '', inquiryType: 'General', message: '', homepage: '' })
        } catch (error) {
            console.error('Contact form submission failed:', error)
            setStatus('error')
            setStatusMessage('Something went wrong. Please try again later.')
        }
    }

    const renderError = (field) => {
        if (!errors[field]) return null
        return (
            <p id={`${field}-error`} className="mt-1 text-sm text-red-600">
                {errors[field]}
            </p>
        )
    }

    return (
        <section className="text-gray-600 body-font relative">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Reach out with questions, requests, or feedback. We&apos;re here to help.
                    </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Contact information</h2>
                        <div className="space-y-6 text-sm text-slate-700">
                            <div>
                                <p className="font-semibold text-slate-900">Email</p>
                                <p className="mt-1 text-slate-600">{contactInfo.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Phone</p>
                                <p className="mt-1 text-slate-600">{contactInfo.phone}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Address</p>
                                <p className="mt-1 text-slate-600">{contactInfo.address}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Hours</p>
                                <p className="mt-1 text-slate-600">{contactInfo.hours}</p>
                            </div>
                            {contactInfo.socialLinks?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-slate-900">Social</p>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {contactInfo.socialLinks.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className="text-indigo-600 hover:text-indigo-800"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
                                        Full name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.fullName)}
                                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Your full name"
                                        autoComplete="name"
                                    />
                                    {renderError('fullName')}
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                        Email address <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                    {renderError('email')}
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.phone)}
                                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Optional"
                                        autoComplete="tel"
                                    />
                                    {renderError('phone')}
                                </div>

                                <div>
                                    <label htmlFor="inquiryType" className="mb-2 block text-sm font-medium text-slate-700">
                                        Inquiry type
                                    </label>
                                    <select
                                        id="inquiryType"
                                        name="inquiryType"
                                        value={form.inquiryType}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.inquiryType)}
                                        aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
                                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        {inquiryOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {renderError('inquiryType')}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                                    Subject <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={form.subject}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.subject)}
                                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="What can we help you with?"
                                />
                                {renderError('subject')}
                            </div>

                            <div className="mt-4">
                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                                    Message <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    value={form.message}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.message)}
                                    aria-describedby={errors.message ? 'message-error' : undefined}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Tell us how we can help."
                                />
                                {renderError('message')}
                            </div>

                            <input
                                type="text"
                                name="homepage"
                                id="homepage"
                                value={form.homepage}
                                onChange={handleChange}
                                className="hidden"
                                autoComplete="off"
                                tabIndex={-1}
                            />

                            <div className="mt-6 space-y-4">
                                {status === 'success' && (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700" role="status" aria-live="polite">
                                        <p>{statusMessage}</p>
                                        {reference ? <p className="mt-2 text-sm">Reference: <strong>{reference}</strong></p> : null}
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700" role="alert" aria-live="assertive">
                                        <p>{statusMessage}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    {isSubmitting ? 'Sending…' : 'Submit message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default contactUs
