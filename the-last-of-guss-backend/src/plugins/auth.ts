import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';

const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(jwt, {
        secret: process.env.JWT_SECRET!,
        cookie: {
            cookieName: 'token',
            signed: false,
        },
    });

    // Добавляем метод fastify.authenticate
    fastify.decorate('authenticate', async function (request: any, reply: any) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    });
};

export default fp(authPlugin);
