import Worker from '@/assets/workers/fetch.worker.ts?worker'

let worker: Worker | null = null

if (!worker) {
  worker = new Worker()
}

worker.addEventListener('message', (event: MessageEvent) => {
  const { data } = event

  if (data.status === 'success') {
    console.log(data.message)
  }

  if (data.status === 'error') {
    console.log(data.message, data.error)
  }
})

export const useFetchWorker = () => {
  const allNotes = ref([])

  interface NoteFetcher {
    userId: string
  }

  const getAllNotes = (message: {
    type: 'all' | 'byId'
    body: NoteFetcher
  }) => {
    return worker.postMessage(message)
  }

  worker.onmessage = (event) => {
    if (!event.data) return

    allNotes.value = event.data
  }

  return {
    getAllNotes,
    allNotes,
  }
}
