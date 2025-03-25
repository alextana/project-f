import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You need to be logged in to see this resource',
    })
  }

  const notes = await db.query.note.findMany({
    where: (note, { eq }) => eq(note.userId, session.user.id),
  })

  if (!notes.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No notes found',
    })
  }

  return {
    notes,
  }
})
