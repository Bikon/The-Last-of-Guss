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

    // Получение информации о конкретном раунде
    fastify.get('/api/rounds/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const user = request.user;
        const { id } = request.params as { id: string };

        const round = await prisma.round.findUnique({
            where: { id },
            include: {
                scores: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!round) {
            return reply.code(404).send({ error: 'Раунд не найден' });
        }

        const now = new Date();
        let status: 'cooldown' | 'active' | 'ended' = 'cooldown';

        if (now >= round.startAt && now < round.endAt) status = 'active';
        else if (now >= round.endAt) status = 'ended';

        const userScore = round.scores.find((s) => s.userId === user.userId);

        // Победитель только если ended
        const winner =
            status === 'ended'
                ? round.scores.reduce(
                    (acc, s) => (s.score > acc.score ? s : acc),
                    { user: { username: '' }, score: 0 }
                )
                : null;

        return {
            id: round.id,
            startAt: round.startAt,
            endAt: round.endAt,
            cooldownStart: round.cooldownStart,
            status,
            totalScore: round.totalScore,
            myScore: user.role === 'nikita' ? 0 : userScore?.score ?? 0,
            winner: winner
                ? {
                    username: winner.user.username,
                    score: winner.score,
                }
                : null,
        };
    });
};

export default roundsRoutes;