<template>
  <div class="flex justify-end items-center gap-3">
    <UButton @click="getPrevNextId('previous')" icon="lucide-chevron-left" />
    <UButton @click="getPrevNextId('next')" icon="lucide-chevron-right" />
  </div>
  <!-- <div v-if="loaded && !notesObservable">Note could not be found.</div> -->
  <KeepAlive>
    <NoteEditor
      v-if="notesObservable"
      :content="notesObservable.content || ''"
      :title="notesObservable.title || ''"
      :note-id="route.params.id as string || ''"
    />
  </KeepAlive>
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
  const currentNoteId = route.params.id as string

  if (!currentNoteId) return null

  const currentNote = await db.notes.get(currentNoteId)

  if (!currentNote) return null
  const currentDate = new Date(currentNote.createdAt)

  if (direction === 'next') {
    let nextNote = await db.notes
      .orderBy('createdAt') // Use orderBy for string dates
      .filter((note) => new Date(note.createdAt) > currentDate) // Custom filter
      .first()

    if (nextNote) {
      navigateTo(`/notes/${nextNote.id}`)
    }
    return
  }

  if (direction === 'previous') {
    let previousNotes = await db.notes
      .orderBy('createdAt') // Use orderBy for string dates
      .filter((note) => new Date(note.createdAt) < currentDate) // Custom filter
      .first()

    if (previousNotes) {
      navigateTo(`/notes/${previousNotes.id}`)
    }
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
