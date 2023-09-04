"use client"
import { useState, forwardRef } from 'react'
import { API_URL } from '../const'
import ResponseCard from '../components/ResponseCard'
import { ResponseSchema, type Response  } from '../schemas/response'
import type { Ref } from 'react'

type SelectProps = {
  options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef( function Select(
  { options, value, onChange, name, ...props }: SelectProps,
  ref: Ref<HTMLSelectElement>) {
  return (
      <div>
        <label htmlFor={name}>{name}</label>
          <select
            {...props}
            ref={ref}
            className="border border-gray-400 rounded-md p-2 m-2 dark:tet-slate-300 dark:bg-gray-900"
            name={name}
            id={name}
            onChange={onChange}
            value={value}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
          </select>
    </div>
  )
})

export default function Page() {
  const [response, setResponse] = useState<Response | null>(null)
  const [endpoint, setEndpoint] = useState<'nextjs' | 'backend'>('backend')
  const [authType, setAuthType] = useState<'headers' | 'cookie' | 'none'>('headers')

  // TODO this is not really a mutation but just a regular form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = endpoint === 'backend' ? `${API_URL}/auth/header` : `/api/auth/header`
    // TODO pick the correct value (it's not the first one)
    //@ts-ignore
    const secret = e.currentTarget[0].value
    // TODO replace fetch with react-query so we can have a cache
    // TODO configure changes based on authType
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authType === 'headers' ? { 'Authorization': `Bearer ${secret}` } : {}),
      },
    })
      .then((res) => res.ok ? res : Promise.reject(res))
      .then((res) => res.json())
      .then((data) => ResponseSchema.parse(data))
      .then((data) => setResponse(data))
      .catch((err) => setResponse({ msg: 'Failed', error: String(err) }))
  }

  return (
    <div className='flex flex-col w-full'>
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <Select options={[
          { value: 'headers', label: 'Headers' },
          { value: 'cookie', label: 'Cookie' },
          { value: 'none', label: 'None' },
          ]}
          value={authType}
          name="authType"
          onChange={(e) => setAuthType(e.target.value as 'headers' | 'cookie' | 'none')}
          />
        <Select options={[
            { value: 'nextjs', label: 'NextJS' },
            { value: 'backend', label: 'Backend' },
          ]}
          value={endpoint}
          name="endpoint"
          onChange={(e) => setEndpoint(e.target.value as 'nextjs' | 'backend')}
        />
        <div>
          <label htmlFor="secret">Secret</label>
          <input
            className="border border-gray-400 rounded-md p-2 m-2 dark:tet-slate-300 dark:bg-gray-900"
            type="text"
            placeholder="secret" />
          <button className="border border-gray-400 rounded-md p-2 m-2 dark:tet-slate-300 dark:bg-gray-900" type="submit">Submit</button>
        </div>
      </form>
      {response != null && <ResponseCard response={response} />}
    </div>
  )
}
