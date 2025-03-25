<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-if="status !== 'pending' && !data?.length">No notes found.</div>
  <div
    class="text-lg text-center py-12"
    v-if="!session.data && status !== 'pending' && !session.isPending"
  >
    Access denied. Please
    <NuxtLink class="text-primary-500" to="/login">login</NuxtLink> to view this
    page.
  </div>

  <div v-if="session.data && status !== 'pending' && data?.length">
    notes index data is: {{ data }}
  </div>
</template>

<script setup lang="ts">
import { useSession } from '~/lib/auth-client'
import type { Note } from '~/types/Notes'
const { status, data } = await useFetch<Note[]>('/api/notes/getNotes')

const session = useSession()
</script>
