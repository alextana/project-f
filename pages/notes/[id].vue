<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-if="status !== 'pending' && !data && session.data">
    The requested note could not be found.
  </div>
  <div
    class="text-lg text-center py-12"
    v-if="!session.data && status !== 'pending' && !session.isPending"
  >
    Access denied. Please
    <NuxtLink class="text-primary-500" to="/login">login</NuxtLink> to view this
    page.
  </div>
  <div v-if="session.data && status !== 'pending' && data">
    <NoteEditor
      :content="data?.note.content || ''"
      :title="data?.note.title"
      :note-id="route.params.id as string || ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/types/Notes'
import { useSession } from '~/lib/auth-client'
const route = useRoute()
const session = useSession()

const { status, data } = await useFetch<Note>(
  '/api/notes/note/' + route.params.id
)
</script>
