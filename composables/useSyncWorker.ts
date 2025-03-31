import Worker from '@/assets/workers/sync.worker.ts?worker'

// the worker should probably be a singleton
let worker: Worker | null = null

/**
 * Only create a worker in case
 * we don't have one
 */
if (!worker) {
  worker = new Worker()

  worker.addEventListener('message', (event: MessageEvent) => {
    const { data } = event

    if (data.status === 'success') {
      console.log(data.message)
    }

    if (data.status === 'error') {
      console.log(data.message, data.error)
    }
  })
}

export const useSyncWorker = () => {
  interface NoteBody {
    id: string
    noteId: string
    userId: string
    action: 'update' | 'create' | 'delete'
  }
  const postToWorker = (message: { type: 'notes'; body: NoteBody }) => {
    worker.postMessage(message)
  }

  return {
    postToWorker,
  }
}
