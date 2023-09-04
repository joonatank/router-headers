import { NextResponse } from 'next/server'
import { API_URL } from '@/const'

const URL = `${API_URL}/auth/header`
export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers)
  const res = await fetch(URL, { headers })
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .then((res) => res.json())

  return NextResponse.json(res)
}
