<template>
  <div
    v-if="(loaded && !groupedNotes) || Object.keys(groupedNotes).length === 0"
  >
    Notes could not be found.
  </div>

  <UButton @click="postToWorker"> sync now </UButton>

  <div
    class="my-4"
    v-for="(notes, dateHeader) in groupedNotes"
    :key="dateHeader"
  >
    <div class="mb-2 flex gap-1 font-extrabold items-center text-gray-400">
      <UIcon name="lucide-calendar" class="text-sm block mb-2" />
      <span class="mb-2 text-sm">{{ dateHeader }}</span>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      <NuxtLink :to="`/notes/${note.id}`" v-for="note in notes" :key="note.id">
        <UCard
          class="hover:outline-1 relative self-stretch h-full hover:outline-gray-600 bg-neutral-950/20 hover:bg-neutral-950/30"
        >
          <div
            v-if="note.isPublic === false"
            class="note shared absolute right-2 top-2"
          >
            <UTooltip text="Private note" :delay-duration="0">
              <UIcon name="lucide-earth-lock" class="text-gray-500 text-md" />
            </UTooltip>
          </div>
          <UIcon
            name="lucide-sticky-note"
            class="text-gray-400 text-2xl block mb-2"
          />
          <span class="font-semibold">
            {{ note.title || 'Untitled note' }}
          </span>

          <div class="edited">
            <span v-if="note.updatedAt" class="text-[10px] text-gray-400">
              Last edited:
              {{ format(note.updatedAt, { date: 'medium', time: 'short' }) }}
            </span>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, sameDay, addDay } from '@formkit/tempo'
import { db, type Note } from '~/lib/dexie'
import { liveQuery } from 'dexie'

const { postToWorker } = useSyncWorker()

const loaded = ref(false)

// observable query
const notesObservable = useObservable(
  liveQuery(() => {
    loaded.value = true
    return db.notes
      .where('userId')
      .equals('local')
      .reverse()
      .sortBy('createdAt')
  }) as any
) as Ref<Note[] | undefined>

const formatDateHeader = (date: Date): string => {
  const today = new Date()
  const yesterday = addDay(new Date(), -1)

  if (sameDay(date, today)) {
    return 'Today'
  }

  if (sameDay(date, yesterday)) {
    return 'Yesterday'
  }

  return format(date, { date: 'medium' })
}

const groupedNotes = computed(() => {
  if (!notesObservable.value) {
    return {}
  }

  const grouped: { [key: string]: Note[] } = {}

  notesObservable.value.forEach((note) => {
    if (!note.createdAt) return

    const createdAtDate = new Date(note.createdAt)
    const dateHeader = formatDateHeader(createdAtDate)

    if (!grouped[dateHeader]) {
      grouped[dateHeader] = []
    }

    grouped[dateHeader].push(note)
  })

  return grouped
})
</script>
