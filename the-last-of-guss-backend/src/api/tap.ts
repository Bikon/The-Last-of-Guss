import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tapRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/api/rounds/:id/tap', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { id: roundId } = request.params as { id: string };
        const user = request.user;

        const now = new Date();

        const round = await prisma.round.findUnique({
            where: { id: roundId },
        });

        if (!round) {
            return reply.code(404).send({ error: 'Раунд не найден' });
        }

        if (!(now >= round.startAt && now < round.endAt)) {
            return reply.code(400).send({ error: 'Раунд не активен' });
        }

        // Никита может тапать, но очки ему не засчитываются
        const isNikita = user.role === 'nikita';

        const result = await prisma.$transaction(async (tx) => {
            // Найдём или создадим счёт
            let score = await tx.score.findUnique({
                where: {
                    userId_roundId: {
                        userId: user.userId,
                        roundId: roundId,
                    },
                },
            });

            if (!score) {
                score = await tx.score.create({
                    data: {
                        userId: user.userId,
                        roundId: roundId,
                        taps: 0,
                        score: 0,
                    },
                });
            }

            const newTaps = score.taps + 1;
            const gained = newTaps % 11 === 0 ? 10 + 1 : 1;

            // Обновляем очки пользователя
            await tx.score.update({
                where: {
                    userId_roundId: {
                        userId: user.userId,
                        roundId: roundId,
                    },
                },
                data: {
                    taps: newTaps,
                    score: isNikita ? score.score : score.score + gained,
                },
            });

            // Обновляем общий счёт раунда
            if (!isNikita) {
                await tx.round.update({
                    where: { id: roundId },
                    data: {
                        totalScore: { increment: gained },
                    },
                });
            }

            return {
                newScore: isNikita ? 0 : score.score + gained,
            };
        });

        return { score: result.newScore };
    });
};

export default tapRoutes;
