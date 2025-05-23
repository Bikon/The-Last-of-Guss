import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const authRoutes: FastifyPluginAsync = async (fastify) => {
    // POST /api/login
    fastify.post('/api/login', async (request, reply) => {
        const { username, password } = request.body as { username: string; password: string };

        if (!username || !password) {
            return reply.code(400).send({ error: 'Имя и пароль обязательны' });
        }

        let user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            const hash = await bcrypt.hash(password, 10);
            let role: Role = 'survivor';

            if (username.toLowerCase() === 'admin') role = 'admin';
            if (username.toLowerCase() === 'никита' || username.toLowerCase() === 'nikita') role = 'nikita';

            user = await prisma.user.create({
                data: { username, password: hash, role },
            });
        } else {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return reply.code(401).send({ error: 'Неверный пароль' });
        }

        const token = fastify.jwt.sign({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        reply
            .setCookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
                maxAge: 7 * 24 * 60 * 60,
            })
            .send({ success: true });
    });

    // GET /api/me
    fastify.get('/api/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { userId, username, role } = request.user;
        return { id: userId, username, role };
    });

    fastify.post('/api/logout', async (request, reply) => {
        reply.clearCookie('token', { path: '/' }).send({ success: true });
    });
};

export default authRoutes;
