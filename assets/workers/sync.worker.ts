import { db } from '~/lib/dexie'

/**
 * @description: This is a web worker that handles synchronization tasks.
 * it will listen to messages from the main thread and synchronise
 * the dexie db with the server.
 */

self.addEventListener('message', (event) => {
  console.log(db)
  console.log('event', event)
  console.log('receive messsage')
})
