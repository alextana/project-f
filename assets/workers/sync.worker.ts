import { db } from '~/lib/dexie'
import { ofetch } from 'ofetch'
/**
 * @description: This is a web worker that handles synchronization tasks.
 * it will listen to messages from the main thread and synchronise
 * the dexie db with the server.
 */

self.addEventListener('message', async (event: MessageEvent) => {
  if (event.data.type === 'notes') {
    /**
     * Sync with the server
     * pass the body to the api and deal with conflict resolution
     */
    const sync = await ofetch('/api/sync/notes/diff', {
      method: 'POST',
      body: event.data.body,
    })

    console.log('dd', sync)

    // try {
    //   self.postMessage({ status: 'success', message: 'sync happened!' })
    // } catch (error) {
    //   self.postMessage({
    //     status: 'error',
    //     message: 'something went wrong..',
    //     error: error,
    //   })
    // }
  }
})
