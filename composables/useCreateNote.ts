import { db } from '~/lib/dexie'
import { nanoid } from 'nanoid'

export const useCreateNote = () => {
  const createNote = async () => {
    const id = nanoid()

    let note = null
    try {
      note = await db.notes.add({
        id,
        title: null,
        content: null,
        userId: 'local',
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
