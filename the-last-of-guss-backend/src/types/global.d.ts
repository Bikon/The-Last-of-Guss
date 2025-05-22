import '@fastify/jwt';
import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
    }

    interface FastifyReply {
        setCookie: (name: string, value: string, options?: any) => FastifyReply;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { userId: string; role: string; username: string };
        user: { userId: string; role: string; username: string };
    }
}
