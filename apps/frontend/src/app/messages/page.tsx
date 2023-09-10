// TODO make this configurable
const GO_API_URL = 'http://localhost:8080/api/'
async function Page() {
  // TODO do a backend request to the go-backend at 8080
  // TODO check for errors, and return errors as values
  // TODO zod validation
  // TODO add other endpoints
  // TODO add authentication
  // TODO add post request
  // TODO add singular vs list views for resources
  const data = await fetch(`${GO_API_URL}messages`)
    .then((res) => res.ok ? res : Promise.reject(res))
    .then((res) => res.json())
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <h1 className="text-3xl font-semibold">Messages Page</h1>
      <p>From Go backend</p>
      <p>{data.message}</p>
    </main>
  )
}

export default Page
