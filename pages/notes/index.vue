<template>
  <div v-if="!notesObservable?.length">Notes could not be found.</div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
    <UCard
      v-for="note in notesObservable"
      :key="note.id"
      class="hover:outline-1 hover:outline-gray-600 bg-neutral-950/20"
    >
      <UIcon
        name="lucide-sticky-note"
        class="text-gray-400 text-2xl block mb-2"
      />
      <span class="font-semibold">
        {{ note.title || 'Untitled note' }}
      </span>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'

const notesObservable = useObservable(
  liveQuery(() => db.notes.where('userId').equals('local').toArray()) as any
) as Ref<Note[] | undefined>
</script>
