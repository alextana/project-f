import { db as dexieDb } from '~/lib/dexie'
import { useSession } from '~/lib/auth-client'

export const useSyncDatabase = () => {
  const session = useSession()

  const syncRemote = async () => {
    try {
      if (!session.value.data?.user?.id) {
        throw new Error('Access denied')
      }

      await $fetch('/api/sync/notes/flag', {
        method: 'PATCH',
        body: {
          lastSynced: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error('Could not update the sync date for the remote DB')
    }
  }

  const syncLocal = async () => {
    try {
      if (!session.value.data?.user?.id) {
        throw new Error('Access denied')
      }

      /**
       * Sanity check to check whether settings exist
       * this shouldn't happen but good to have
       */
      const userSettings = await dexieDb.settings.get(
        session.value.data?.user?.id as string
      )

      if (!userSettings) {
        await dexieDb.settings.add({
          userId: session.value.data?.user?.id as string,
          lastSynced: new Date().toISOString(),
          automaticSync: 'false',
        })

        return
      }

      await dexieDb.settings.update(session.value.data?.user?.id as string, {
        lastSynced: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Could not update the sync date for the local DB')
    }
  }

  return {
    syncLocal,
    syncRemote,
  }
}
