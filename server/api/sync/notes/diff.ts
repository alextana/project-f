import { auth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  const body = await readBody(event)

  console.log(session)

  console.log(body)

  return {
    body,
  }
})
