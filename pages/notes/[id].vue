<template>
  <div v-if="loaded && !notesObservable">Note could not be found.</div>

  <div ref="parent">
    <NoteEditor
      v-if="notesObservable"
      :content="notesObservable.content || null"
      :title="notesObservable.title || ''"
      :note-id="route.params.id as string || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'

const [parent] = useAutoAnimate()

const route = useRoute()
const loaded = ref(false)

const notesObservable = useObservable(
  liveQuery(() => {
    loaded.value = true
    return db.notes.get(route.params.id as string)
  }) as any
) as Ref<Note | undefined>

/**
 * Handles newly created pages that had no content
 * no sync needed, we can just get rid of the note
 * if it hasn't been edited
 */
onBeforeRouteLeave(async () => {
  if (
    notesObservable.value?.content === null &&
    notesObservable.value?.title === null &&
    notesObservable.value?.createdAt === notesObservable.value?.updatedAt
  ) {
    try {
      await db.notes.delete(route.params.id as string)
    } catch (error) {
      console.error(`Error deleting empty note`)
    }
  }
})
</script>
