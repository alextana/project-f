import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import { note } from '~/server/db/schema'
import { z } from 'zod'
import superjson from 'superjson'

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

  // validate the content to make sure
  // it's a valid tiptap content shape
  const NoteContent = z.object({
    type: z.string(),
    content: z.array(z.any()),
  })

  try {
    NoteContent.parse(superjson.parse(body.note.content))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)

      throw createError({
        statusCode: 422,
        statusMessage: 'The note content is not a valid tiptap content shape',
      })
    }
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
