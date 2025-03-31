<template>
  <UModal v-if="!hasSettings">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { db } from '~/lib/dexie'
import { useSession } from '~/lib/auth-client'
import AutomaticSyncModal from '~/components/AutomaticSyncModal.vue'

const session = useSession()

const automaticSync = ref(false)
const hasSettings = ref(true)

const overlay = useOverlay()

const modal = overlay.create(AutomaticSyncModal)

async function open() {
  await modal.open()
}

watch(
  session,
  async () => {
    if (!session?.value?.data?.user.id) return

    const userSettings = await db.settings.get(
      session.value.data?.user?.id as string
    )

    if (!userSettings) {
      open()

      console.log('doing it?')
    }

    try {
      await db.notes.toCollection().modify((note) => {
        note.userId = session.value?.data?.user.id as string
      })
    } catch (error) {
      console.error(error)
    }

    // try {
    //   await db.settings.add({
    //     userId: session.value.data?.user?.id as string,
    //     lastSynced: new Date().toISOString(),
    //     automaticSync: automaticSync.value.toString(),
    //   })
    // } catch (error) {}

    // navigateTo('/notes')
  },
  {
    once: true,
  }
)
</script>
