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
  console.log('Server is now listening on http://localhost:4000')
  // Server is now listening on ${address}
})
