import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import { decryptData } from '~/utils/encryption'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 422,
      statusMessage: 'ID Does not exist',
    })
  }

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You need to be logged in to see this resource',
    })
  }

  const userNote = await db.query.note.findFirst({
    where: (note, { eq, and }) =>
      and(eq(note.userId, session.user.id), eq(note.id, id)),
  })

  if (!userNote) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Note not found',
    })
  }

  if (userNote.userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to view this note',
    })
  }

  return {
    note: {
      ...userNote,
      content: decryptData(userNote.content)?.toString() || '',
      title: decryptData(userNote.title)?.toString() || '',
    },
  }
})
