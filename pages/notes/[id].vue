<template>
  <div class="flex justify-end items-center gap-3">
    <UButton @click="getPrevNextId('previous')" icon="lucide-chevron-left" />
    <UButton @click="getPrevNextId('next')" icon="lucide-chevron-right" />
  </div>
  <!-- <div v-if="loaded && !notesObservable">Note could not be found.</div> -->
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
import { map, startWith } from 'rxjs/operators'

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

async function getPrevNextId(direction: string) {
  if (!route.params.id) return null

  const currentNote = await db.notes.get(route.params.id as string)

  if (!currentNote) return null

  const currentDate = new Date(currentNote.createdAt)

  if (direction === 'next') {
    let nextNote = await db.notes
      .orderBy('createdAt')
      .reverse()
      .filter((note) => new Date(note.createdAt) < currentDate)
      .first()

    if (!nextNote) return

    navigateTo(`/notes/${nextNote.id}`)

    return
  }

  if (direction === 'previous') {
    let previousNote = await db.notes
      .orderBy('createdAt')
      .filter((note) => new Date(note.createdAt) > currentDate)
      .first()

    if (!previousNote) return

    navigateTo(`/notes/${previousNote.id}`)

    return
  }

  return null
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    getPrevNextId('next')
  } else if (event.key === 'ArrowLeft') {
    getPrevNextId('previous')
  }
}
</script>
