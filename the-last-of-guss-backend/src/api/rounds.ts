import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roundsRoutes: FastifyPluginAsync = async (fastify) => {
    // Получить список всех раундов
    fastify.get('/api/rounds', async (request, reply) => {
        const rounds = await prisma.round.findMany({
            orderBy: { startAt: 'desc' },
        });

        const now = new Date();

        return rounds.map((r) => {
            let status: 'cooldown' | 'active' | 'ended' = 'cooldown';

            if (now >= r.startAt && now < r.endAt) status = 'active';
            else if (now >= r.endAt) status = 'ended';

            return {
                id: r.id,
                startAt: r.startAt,
                endAt: r.endAt,
                cooldownStart: r.cooldownStart,
                status,
            };
        });
    });

    // Создание раунда (только для админа)
    fastify.post('/api/rounds', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;

        if (user.role !== 'admin') {
            return reply.code(403).send({ error: 'Forbidden' });
        }

        const now = new Date();
        const cooldownSeconds = parseInt(process.env.COOLDOWN_DURATION || '30');
        const durationSeconds = parseInt(process.env.ROUND_DURATION || '60');

        const cooldownStart = now;
        const startAt = new Date(now.getTime() + cooldownSeconds * 1000);
        const endAt = new Date(startAt.getTime() + durationSeconds * 1000);

        const round = await prisma.round.create({
            data: {
                cooldownStart,
                startAt,
                endAt,
            },
        });

        return {
            id: round.id,
            startAt,
            endAt,
            cooldownStart,
            status: 'cooldown',
        };
    });
};

export default roundsRoutes;