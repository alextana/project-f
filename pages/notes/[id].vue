<template>
  <!-- <div v-if="loaded && !notesObservable">Note could not be found.</div> -->

  <div ref="parent">
    <NoteEditor
      v-if="notesObservable"
      :content="notesObservable.content || ''"
      :title="notesObservable.title || ''"
      :note-id="route.params.id as string || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

const [parent] = useAutoAnimate()

const route = useRoute()
const loaded = ref(false)

onBeforeUnmount(() => (loaded.value = false))

const notesObservable = useObservable(
  from(
    liveQuery(() => {
      return db.notes.get(route.params.id as string)
    })
  ).pipe(
    startWith(undefined as Note | undefined),
    map((note) => note)
  ),
  undefined
) as Ref<Note | undefined>

/**
 * Handles newly created pages that had no content
 * no sync needed, we can just get rid of the note
 * if it hasn't been edited
 */
onBeforeRouteLeave(async () => {
  if (
    notesObservable.value?.content === '' &&
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
