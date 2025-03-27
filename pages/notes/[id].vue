<template>
  <div v-if="!notesObservable">Note could not be found.</div>

  <NoteEditor
    v-if="notesObservable"
    :content="notesObservable.content"
    :title="notesObservable.title || ''"
    :note-id="route.params.id as string || ''"
  />
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'

const route = useRoute()

const notesObservable = useObservable(
  liveQuery(() => db.notes.get(route.params.id as string)) as any
) as Ref<Note | undefined>
</script>
