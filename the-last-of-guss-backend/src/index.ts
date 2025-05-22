import Fastify from 'fastify';
import dotenv from 'dotenv';
import cookie from '@fastify/cookie';

import authPlugin from './plugins/auth';
import authRoutes from './api/auth';
import roundsRoutes from './api/rounds';
import tapRoutes from './api/tap';

dotenv.config();

async function main() {
    const app = Fastify({ logger: true });

    app.register(cookie);
    app.register(authPlugin);
    app.register(authRoutes);
    app.register(roundsRoutes);
    app.register(tapRoutes);

    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server started on http://localhost:3000');
}

main().catch((err) => {
    console.error('Fatal error while starting server:', err);
    process.exit(1);
});
