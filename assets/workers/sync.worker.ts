import { db } from '~/lib/dexie'
import { ofetch } from 'ofetch'
/**
 * @description: This is a web worker that handles synchronization tasks.
 * it will listen to messages from the main thread and synchronise
 * the dexie db with the server.
 */

/**
 * call to the API that syncs all notes
 * all the logic is server side
 */
const syncAllNotes = async (event: MessageEvent) => {
  const localNotes = await db.notes
    .where('userId')
    .equals(event.data.body.userId)
    .toArray()

  return await ofetch('/api/sync/notes/all', {
    method: 'POST',
    body: {
      localNotes,
      ...event.data.body,
    },
  })
}

self.addEventListener('message', async (event: MessageEvent) => {
  if (event.data?.type === 'notes') {
    /**
     * Sync with the server
     * pass the body to the api and deal with conflict resolution
     */
    if (event.data.body.action === 'compare_all') {
      syncAllNotes(event)

      return
    }

    let note = null

    if (
      event.data.body.action === 'update' ||
      event.data.body.action === 'delete'
    ) {
      note = await db.notes.get(event.data.body.noteId)
    }

    let updatedNote = null

    try {
      updatedNote = await ofetch('/api/sync/notes/upsert', {
        method: 'POST',
        body: {
          ...event.data.body,
          ...(note && { note: note }),
        },
      })
    } catch (error) {
      console.error(error)
    }

    // try {
    //   self.postMessage({ status: 'success', message: 'sync happened!' })
    // } catch (error) {
    //   self.postMessage({
    //     status: 'error',
    //     message: 'something went wrong..',
    //     error: error,
    //   })
    // }

    return {
      updatedNote,
    }
  }
})
