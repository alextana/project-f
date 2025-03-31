import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import { settings } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  const body = await readBody(event)

  if (!session?.user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  if (!body.lastSynced) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Cannot sync without the timestamp',
    })
  }

  try {
    await db
      .insert(settings)
      .values({ userId: session?.user.id })
      .onConflictDoUpdate({
        target: settings.userId,
        set: { lastSynced: body.lastSynced },
      })
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unexpected error',
    })
  }
})
