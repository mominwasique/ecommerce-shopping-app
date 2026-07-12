'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact-submission.contact-submission', {
    only: [],
    routes: [
        {
            method: 'POST',
            path: '/submit',
            handler: 'contact-submission.submit',
            config: {
                prefix: '/contact',
            },
        },
    ],
});
