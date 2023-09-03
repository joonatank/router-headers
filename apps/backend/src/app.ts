import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

import routes from './routes'

function build(opts = {}): FastifyInstance {
  const fastify = Fastify({
    ...opts,
  })

  void fastify.register(cors, {
    origin: [/^http:\/\/localhost/],
  })

  void fastify.register(routes, { prefix: '/' })

  return fastify
}

export default build
