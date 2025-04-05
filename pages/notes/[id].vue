<template>
  <div v-if="loaded && !notesObservable">Note could not be found.</div>
  <NoteEditor
    v-if="notesObservable"
    :content="notesObservable.content || ''"
    :title="notesObservable.title || ''"
    :note-id="route.params.id as string || ''"
  />
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { tap } from 'rxjs/operators'

const route = useRoute()
const loaded = ref(false)

onBeforeUnmount(() => (loaded.value = false))

const notesObservable = useObservable(
  from(liveQuery(() => db.notes.get(route.params.id as string))).pipe(
    tap(() => {
      loaded.value = true
    })
  )
) as Ref<Note | undefined>

onMounted(async () => {
  try {
    await db.notes.update(route.params.id as string, {
      lastVisitedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error updating last visited date`, error)
  }
})

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
