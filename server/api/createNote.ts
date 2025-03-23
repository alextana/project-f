import { db } from '~/server/utils/db'
import { nanoid } from 'nanoid'
import { notesTable } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const newId = nanoid()

  await db.insert(notesTable).values({
    id: newId,
    title: '',
    content: '',
    userId: 2,
  })

  return {
    noteId: newId,
  }
})
