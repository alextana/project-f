import { db } from '~/lib/dexie'
import { nanoid } from 'nanoid'

export const useCreateNote = () => {
  const createNote = () => {
    const id = nanoid()

    let note = null

    try {
      note = db.notes.add({
        id,
        title: null,
        content: null,
        userId: 'local',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })

      navigateTo(`/notes/${id}`)
    } catch (error) {
      console.error(error)
    }

    return note
  }

  return {
    createNote,
  }
}
