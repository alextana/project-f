<template>
  <div class="flex justify-end w-full">
    <UButton label="Seed random notes" @click="seedNotes" />
  </div>
  <span class="text-gray-400" v-if="totSpace && usSpace">
    Est. total space available: {{ bytesToGB(totSpace) }} GB / Est. used space:
    {{ bytesToMb(usSpace) }} MB
  </span>
  <div class="my-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
    <NuxtLink
      :to="`/notes/${note.id}`"
      v-for="note in notesObservable"
      :key="note.id"
    >
      <div
        class="hover:outline-1 group p-4 shadow-xl border border-neutral-800 rounded-xl relative self-stretch h-full hover:outline-gray-600 bg-neutral-950/20 hover:bg-neutral-950/30"
      >
        <div
          v-if="note.isPublic === 'false'"
          class="note shared absolute right-2 top-2"
        ></div>
        <UIcon
          name="lucide-sticky-note"
          class="text-gray-400 text-2xl block mb-2"
        />
        <span class="font-semibold">
          {{ note.title || 'New note' }}
        </span>

        <div class="edited">
          <span v-if="note.updatedAt" class="text-[10px] text-gray-400">
            <!-- Last edited: -->
            <!-- {{ format(note.updatedAt, { date: 'medium', time: 'short' }) }} -->
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { db, type Note } from '~/lib/dexie'
import { seed } from '~/utils/seed'

const notesObservable = ref<Note[]>([])

const getNotes = async () => {
  notesObservable.value = []

  const notes = await db.notes.reverse().sortBy('createdAt')
  notesObservable.value = notes || []
}

getNotes()

const seedNotes = async () => {
  await seed()
}

const quota = await navigator.storage.estimate()
const totalSpace = Number(quota.quota) || null
const usedSpace = Number(quota.usage) || null

const totSpace = ref<number | null>(null)
const usSpace = ref<number | null>(null)

totSpace.value = totalSpace || null
usSpace.value = usedSpace || null

const bytesToMb = (bytes: number) => {
  const mb = bytes / (1024 * 1024)
  return Math.round(mb)
}

function bytesToGB(bytes: number, decimalPlaces = 2) {
  const gb = bytes / (1024 * 1024 * 1024)
  const roundedGB = Number(gb.toFixed(decimalPlaces))
  return roundedGB
}
</script>
