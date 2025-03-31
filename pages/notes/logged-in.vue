<template>
  <p>Syncing with the database...</p>
</template>

<script setup lang="ts">
import { db } from '~/lib/dexie'
import { useSession } from '~/lib/auth-client'

const session = useSession()

onBeforeMount(async () => {
  if (!session.value?.data?.user.id) return

  try {
    await db.notes.toCollection().modify((note) => {
      note.userId = session.value?.data?.user.id as string
    })
  } catch (error) {
    console.error(error)
  }

  navigateTo('/notes')
})
</script>
