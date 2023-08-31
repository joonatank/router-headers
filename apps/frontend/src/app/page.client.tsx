"use client"
import { API_URL } from '../const'

// JS mutations are impossible on the server
export default function Page() {

  // TODO this is not really a mutation but just a regular form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //@ts-ignore
    const secret = e.currentTarget[0].value
    console.log('secret: ', secret)
    const res = await fetch(`${API_URL}/auth/header`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
    }).then((res) => res.json())
    console.log('respose to mutation: ', res)
    // window.location.reload();
  }

  return (
    <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="secret">Secret</label>
        <input
          className="border border-gray-400 rounded-md p-2 m-2 dark:tet-slate-300 dark:bg-gray-900"
          type="text"
          placeholder="secret" />
      </div>
    </form>
  )
}
