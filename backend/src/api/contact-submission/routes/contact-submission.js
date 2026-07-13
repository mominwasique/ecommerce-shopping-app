'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/contact/submit',
            handler: 'api::contact-submission.contact-submission.submit',
            config: {
                auth: false,
            },
        },
    ],
};
