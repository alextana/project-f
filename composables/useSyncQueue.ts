import { db } from '~/lib/dexie'

interface AddActionToQueue {
  id: string
  noteId: string
  userId: string
  action: 'update' | 'create' | 'delete'
  title: string
  content: string
  status: 'completed' | 'pending' | 'error' | 'conflict'
  createdAt: string
  completedAt: string | null
}

const { postToWorker } = useSyncWorker()

export const useSyncQueue = () => {
  const addActionToQueue = async (action: AddActionToQueue) => {
    try {
      await db.noteQueue.add(action)
    } catch (error) {
      console.error(error)
    }

    postToWorker({
      type: 'notes',
      body: {
        id: action.id,
        noteId: action.noteId,
        userId: action.userId,
        action: action.action,
      },
    })
  }

  return {
    addActionToQueue,
  }
}
