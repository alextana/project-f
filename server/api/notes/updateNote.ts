import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import { z } from 'zod'
import { note } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { encryptData } from '~/utils/encryption'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  const body = await readBody(event)

  if (!body || !session) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Need a user id to update a note',
    })
  }

  const Note = z.object({
    id: z.string(),
    title: z.optional(z.string()),
    content: z.optional(z.any()),
  })

  let updatedNote = null

  try {
    Note.parse(body)

    updatedNote = await db
      .update(note)
      .set({
        ...(body.title && { title: encryptData(body.title) as string }),
        ...(body.content && {
          content: encryptData(JSON.stringify(body.content)) as string,
        }),
      })
      .where(and(eq(note.id, body.id), eq(note.userId, session.user.id)))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      throw createError({
        statusCode: 422,
        statusMessage:
          'A validation error occurred when trying to update the note',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage:
        'An unexpected error occurred when trying to update the note',
    })
  }

  return {
    data: updatedNote,
  }
})
