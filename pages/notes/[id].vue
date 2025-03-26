<template>
  <div v-if="!notesObservable">Note could not be found.</div>

  <NoteEditor
    v-if="notesObservable"
    :content="notesObservable.content"
    :title="notesObservable.title || ''"
    :note-id="route.params.id as string || ''"
  />

  <!-- <div v-if="status === 'pending'">Loading...</div>
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
  </div> -->
</template>

<script setup lang="ts">
// import { useSession } from '~/lib/auth-client'
import { db, type Note } from '~/lib/dexie'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

const route = useRoute()
// const session = useSession()

const notesObservable = useObservable(
  liveQuery(() => db.notes.get(route.params.id as string)) as any
) as Ref<Note | undefined>
</script>
