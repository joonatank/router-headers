import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

import routes from './routes'

console.log('initialise app')

function build(opts = {}): FastifyInstance {
  console.log('build fastify')
  const fastify = Fastify({
    ...opts,
  })

  void fastify.register(cors, {
    origin: [/^http:\/\/localhost/],
  })

  void fastify.register(routes, { prefix: '/' })

  console.log('routes registered')
  return fastify
}

export default build
