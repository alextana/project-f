<template>
  <div class="mt-4 mb-8 max-w-[960px] mx-auto">
    <h1 class="text-3xl font-bold">
      {{ getGreeting() }}
      <span v-if="session.data?.user">{{
        session.data.user?.name?.split(' ')[0] || ''
      }}</span>
    </h1>

    <div class="recent-notes" v-if="recentNotes">
      <UCarousel
        v-slot="{ item }"
        arrows
        :prev="{ color: 'primary' }"
        :next="{ variant: 'solid' }"
        :items="recentNotes"
        class="my-8 text-sm"
        :ui="{ item: 'basis-1/5' }"
      >
        <div
          class="p-3 rounded-xl w-full bg-neutral-800 border-0 text-pretty h-32 hover:bg-neutral-950/50 shadow-md"
        >
          <p class="font-semibold overflow-hidden text-ellipsis">
            {{ item.title }}
          </p>
        </div>
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSession } from '~/lib/auth-client'
import { db } from '~/lib/dexie'

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

const recentNotes = useObservable(
  liveQuery(() =>
    db.notes.orderBy('lastVisitedAt').reverse().limit(20).toArray()
  )
)
</script>
