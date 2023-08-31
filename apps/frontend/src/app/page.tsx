import { z } from 'zod'
import Client from './page.client'
import { API_URL } from '../const'

const PingSchema = z.object({
  msg: z.string(),
  headers: z.array(z.record(z.string())).optional(),
  cookies: z.array(z.record(z.string())).optional(),
  authorized: z.boolean().optional(),
})

export default async function Home() {
  const ping = await fetch(`${API_URL}/ping`).then((res) => res.json()).then((data) => PingSchema.parse(data));
  const authCookie = await fetch(`${API_URL}/auth/cookie`).then((res) => res.json()).then((data) => PingSchema.parse(data)).catch(() => ({ msg: 'Unauthorized' }));
  const authHeader = await fetch(`${API_URL}/auth/header`).then((res) => res.json()).then((data) => PingSchema.parse(data)).catch(() => ({ msg: 'Unauthorized' }));

  /// TODO to do a refresh from a mutation (that is client side only)
  /// we'd have to Hydrate the page from fetch and then do the mutation that updates the client cache
  /// it's silly but the server component needs to contain the full html content
  /// while not containing any of the state, so we have to do a client driven cache that is Hydrated on the
  /// server with fetch.
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <h1>Page</h1>
      <div>
        <h2 className='text-center text-2xl font-bold'>Server response</h2>
        <div>Server response to ping: {ping.msg}</div>
        <div>Server response to auth header: {authHeader.msg}</div>
        <div>Server response to auth cookie: {authCookie.msg}</div>
      </div>
      <h2>Change the auth</h2>
      <Client />
    </main>
  )
}
