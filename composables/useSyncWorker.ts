import Worker from '@/assets/workers/sync.worker.ts?worker'

// the worker should probably be a singleton
const worker: Worker | null = new Worker()

export const useSyncWorker = () => {
  const postToWorker = () => {
    worker.postMessage('sync')
  }

  return {
    postToWorker,
  }
}
