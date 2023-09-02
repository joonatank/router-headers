import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (_request: FastifyRequest, _reply: FastifyReply) {
    return { root: true }
  })
  fastify.get('/ping', async function (request: FastifyRequest, _reply: FastifyReply) {
    return {
      msg: 'pong',
      headers: request.headers,
    }
  })
  // TODO POST versions also
  fastify.get('/auth/header', async function (request: FastifyRequest, reply: FastifyReply) {
    // TODO check auth header using Bearer strategy with bcrypt (static secret)
    // or is it Token strategy with JWT?

    const authorized = request.headers.authorization != null
    const res = {
      msg: authorized ? 'Authorized with headers' : 'Headers Unauthorized',
      path: '/auth/header',
      headers: request.headers,
      authorized,
    }
    if (request.headers.authorization == null) {
      return reply.status(401).send(res)
    }

    return reply.status(200).send(res)
  })
  fastify.get('/auth/cookie', async function (request: FastifyRequest, reply: FastifyReply) {
    // TODO check auth cookie using Bearer strategy with bcrypt (static secret)
    // or is it Token strategy with JWT?

    // @ts-ignore
    const authorized: string | undefined = request.headers?.cookies ? String(request.headers?.cookies['custom-auth']) : undefined
    const res = {
      msg: authorized ? 'Authorized with cookie' : 'Cookie Unauthorized',
      path: '/auth/cookie',
      cookies: request.headers.cookie,
      headers: request.headers,
      authorized: authorized != null,
    }
    if (authorized == null) {
      return reply.status(401).send(res)
    }

    return reply.status(200).send(res)
  })
}
