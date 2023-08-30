import app from './app'

const server = app({
  logger: true,
})

// Run the server!
server.listen({ port: 4000, host: '0.0.0.0' }, function (err) {
  if (err != null) {
    server.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
