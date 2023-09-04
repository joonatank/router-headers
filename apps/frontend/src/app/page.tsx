import Client from './page.client'
import { API_URL } from '../const'
import { ResponseSchema } from '../schemas/response'
import ResponseCard from '../components/ResponseCard'

export default async function Home() {
  const ping = await fetch(`${API_URL}/ping`)
    .then((res) => res.json())
    .then((data) => ResponseSchema.parse(data))
  const authCookie = await fetch(`${API_URL}/auth/cookie`)
    .then((res) => res.json())
    .then((data) => ResponseSchema.parse(data))
    .catch((err) => ({ msg: 'Failed', error: err }))
  const authHeader = await fetch(`${API_URL}/auth/header`)
    .then((res) => res.json())
    .then((data) => ResponseSchema.parse(data))
    .catch((err) => ({ msg: 'Failed', error: err }))

  /// TODO to do a refresh from a mutation (that is client side only)
  /// we'd have to Hydrate the page from fetch and then do the mutation that updates the client cache
  /// it's silly but the server component needs to contain the full html content
  /// while not containing any of the state, so we have to do a client driven cache that is Hydrated on the
  /// server with fetch.
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <h1 className="text-3xl font-semibold">Communicate with backend</h1>
      <h2 className="text-center text-2xl font-bold">SSR response</h2>
      <div className="flex gap-4">
        <ResponseCard response={ping} />
        <ResponseCard response={authHeader} />
        <ResponseCard response={authCookie} />
      </div>
      <h2 className="text-2xl font-semibold">Change the auth</h2>
      <Client />
    </main>
  )
}

// NOTE: fix a bug where Next tries to do SSG during docker build and fails
// because there is no backend to fetch from
export const runtime = 'edge'
