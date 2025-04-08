<template>
  <div class="max-w-[960px] mx-auto">
    <h1 class="mt-4 mb-8 text-3xl font-bold">
      {{ getGreeting() }}
      <span v-if="session.data?.user">{{
        session.data.user?.name?.split(' ')[0] || ''
      }}</span>
    </h1>

    <div class="recent-notes" v-if="recentNotes">
      <div class="title flex gap-1 items-center">
        <UIcon name="i-lucide-clock" class="text-gray-400" />
        <h2 class="text-md font-semibold">Recently visited notes</h2>
      </div>
      <UCarousel
        v-slot="{ item }"
        arrows
        :prev="{ color: 'primary' }"
        :next="{ variant: 'solid' }"
        :items="recentNotes"
        class="mt-2 mb-8 text-sm"
        :ui="{ item: 'basis-1/5' }"
      >
        <NuxtLink
          v-if="item"
          :to="`/notes/${item.id}`"
          class="block p-3 rounded-xl w-full bg-neutral-800 border-0 text-pretty h-32 hover:bg-neutral-950/50 shadow-md"
        >
          <p class="font-semibold overflow-hidden text-ellipsis">
            {{ item.title }}
          </p>
        </NuxtLink>
      </UCarousel>
    </div>

    <div class="action-map">
      <div class="brain-dump flex items-center gap-1">
        <UIcon name="i-lucide-book" class="text-gray-400" />
        <h3 class="text-md font-semibold">Brain dump</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSession } from '~/lib/auth-client'
import { db, type Note } from '~/lib/dexie'
import { from } from 'rxjs'

const session = useSession()
import { liveQuery } from 'dexie'

const getGreeting = () => {
  const now = new Date()
  const hours = now.getHours()

  return hours < 12
    ? 'Good Morning'
    : hours < 18
    ? 'Good Afternoon'
    : 'Good Evening'
}
const recentNotes =
  (useObservable(
    from(
      liveQuery(() =>
        db.notes.orderBy('lastVisitedAt').reverse().limit(20).toArray()
      )
    )
  ) as Ref<Note[]>) || []
</script>
