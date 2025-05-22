import Fastify from 'fastify';
import authPlugin from './plugins/auth';
import authRoutes from './api/auth';
import roundsRoutes from './api/rounds';

const app = Fastify({ logger: true });

app.register(require('@fastify/cookie'));
app.register(authPlugin);
app.register(authRoutes);
app.register(roundsRoutes);

app.listen({ port: 3000 }, () => {
    console.log('Server started on http://localhost:3000');
});