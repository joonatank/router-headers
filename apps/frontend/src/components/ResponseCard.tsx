import { Response } from '../schemas/response'

function ResponseCard ({ response }: { response: Response
  & { error?: any } }) {
  const headers = response.headers ? Object.entries(response.headers) : []
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-center text-xl font-bold'>Server response</h3>
      <div>message: {response.msg}</div>
      {response.error && <div>error: {response.error?.message}</div>}
      {response.headers && (
        <div>
          headers
          {headers.map((header) => (
            <div key={header[0]}>
              {header[0]}: {header[1]}
            </div>
          ))}
        </div>
      )}
      {/*<div>auth header: {response.headers?.map((header) => header.Authorization)}</div>*/}
      <div>auth cookie: {response.cookies?.map((cookie) => cookie.Authorization)}</div>
      {response.authorized ? <div>authorized</div> : <div>NOT authorized</div>}
    </div>
  )
}

export default ResponseCard
