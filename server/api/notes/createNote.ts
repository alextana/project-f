import { db } from '~/server/utils/db'
import { nanoid } from 'nanoid'
import { note } from '~/server/db/schema'
import { auth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  /**
   * Add logic for non logged in users
   */
  const newId = nanoid()

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Need a user id to create a note',
    })
  }

  await db.insert(note).values({
    id: newId,
    title: null,
    content: null,
    userId: session.user.id,
  })

  return {
    noteId: newId,
  }
})
