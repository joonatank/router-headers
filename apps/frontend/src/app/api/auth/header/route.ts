import { NextResponse } from 'next/server'
import { API_URL } from '@/const'
 
const URL = `${API_URL}/auth/header`
export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url)
  // const id = searchParams.get('id')
  console.log('doing a nextjs fetch')
  const headers = Object.fromEntries(request.headers)
  console.log('headers', headers)
  const res = await fetch(URL, {
    headers}) /* {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  } */
  const auth = await res.json()
 
  return NextResponse.json(auth)
}
