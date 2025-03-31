import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import { note } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  const body = await readBody(event)

  if (!body.action) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Cannot sync without the action type',
    })
  }

  if (body.note.userId !== session?.user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorised',
    })
  }

  const upsertNote = async () => {
    await db.insert(note).values(body.note).onConflictDoUpdate({
      target: note.id,
      set: body.note,
    })
  }

  if (body.action === 'update' || body.action === 'create') {
    upsertNote()
  }

  return
})
