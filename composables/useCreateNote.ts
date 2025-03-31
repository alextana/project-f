import { db } from '~/lib/dexie'
import { nanoid } from 'nanoid'
import { useSession } from '~/lib/auth-client'
const session = useSession()

export const useCreateNote = () => {
  const createNote = () => {
    const id = nanoid()

    let note = null

    try {
      note = db.notes.add({
        id,
        title: null,
        content: '',
        userId: session.value.data?.user?.id || 'local',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isPublic: 'false',
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
