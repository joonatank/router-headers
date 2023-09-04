import { z } from 'zod'

export const ResponseSchema = z.object({
  msg: z.string(),
  headers: z.record(z.string()).optional(),
  // headers: z.unknown(), // z.array(z.record(z.string())).optional(),
  cookies: z.array(z.record(z.string())).optional(),
  authorized: z.boolean().optional(),
  error: z.string().optional(),
})

export type Response = z.infer<typeof ResponseSchema>
