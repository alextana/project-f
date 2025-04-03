<script setup lang="ts">
import { db } from '~/lib/dexie'
import { useSession } from '~/lib/auth-client'
import AutomaticSyncModal from '~/components/AutomaticSyncModal.vue'

const session = useSession()
const overlay = useOverlay()
const modal = overlay.create(AutomaticSyncModal, {})

watch(
  session,
  async () => {
    if (!session?.value?.data?.user.id) return

    postToWorker({
      type: 'notes',
      body: {
        userId: session.value.data?.user?.id as string,
        action: 'compare_all',
      },
    })

    const userSettings = await db.settings.get(
      session.value.data?.user?.id as string
    )

    if (!userSettings) {
      open()
    }

    try {
      await db.notes.toCollection().modify((note) => {
        note.userId = session.value?.data?.user.id as string

        navigateTo('/')
      })
    } catch (error) {
      console.error(error)
    }
  },
  {
    once: true,
  }
)

const { postToWorker } = useSyncWorker()

async function open() {
  const shouldSync = await modal.open()

  if (shouldSync) {
    try {
      await db.settings.add({
        userId: session.value.data?.user?.id as string,
        lastSynced: new Date().toISOString(),
        automaticSync: shouldSync.toString(),
      })
    } catch (error) {}

    navigateTo('/notes')
  }
}
</script>
