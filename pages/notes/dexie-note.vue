<template>
  <NoteAdder />
  <ul>
    <li
      class="px-3 py-2 border rounded-md my-2"
      v-for="note in notes"
      :key="note.id"
    >
      {{ note.title }}, {{ note.content }}
    </li>
  </ul>
</template>

<script>
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { db } from '~/lib/dexie'

export default {
  name: 'Notes',
  setup() {
    return {
      db,
      notes: useObservable(liveQuery(() => db.notes.toArray())),
    }
  },
}
</script>
