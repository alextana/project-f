import { db } from '~/lib/dexie'

const getAllNotes = async (userId: string) => {
  const n = await db.notes
    .where('userId')
    .anyOf([userId as string, 'local'])
    .reverse()
    .sortBy('createdAt')

  self.postMessage(n)
}

self.addEventListener('message', async (event: MessageEvent) => {
  if (event.data?.type === 'all') {
    return await getAllNotes(event.data?.body.userId)
  }
})
