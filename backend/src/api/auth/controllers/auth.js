'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    async register(ctx) {
        const { username, email, password } = ctx.request.body;

        if (!username || !email || !password) {
            return ctx.badRequest('Please provide username, email and password');
        }

        const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email },
        });

        if (existingUser) {
            return ctx.badRequest('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await strapi.db.query('plugin::users-permissions.user').create({
            data: {
                username,
                email,
                password: hashedPassword,
                confirmed: true,
                blocked: false,
            },
        });

        const token = jwt.sign({ id: user.id }, strapi.config.get('jwt.secret') || 'supersecret', {
            expiresIn: '7d',
        });

        return ctx.send({
            jwt: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    },

    async login(ctx) {
        const { email, password } = ctx.request.body;

        if (!email || !password) {
            return ctx.badRequest('Please provide email and password');
        }

        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email },
        });

        if (!user) {
            return ctx.unauthorized('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return ctx.unauthorized('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, strapi.config.get('jwt.secret') || 'supersecret', {
            expiresIn: '7d',
        });

        return ctx.send({
            jwt: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    },

    async logout(ctx) {
        return ctx.send({ message: 'Logged out successfully' });
    },
};
