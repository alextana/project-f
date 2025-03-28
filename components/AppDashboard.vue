<template>
  <div class="mt-4 mb-8 max-w-[960px] mx-auto">
    <h1 class="text-3xl font-bold">
      {{ getGreeting() }}
      <span v-if="session.data?.user">{{
        session.data.user?.name?.split(' ')[0] || ''
      }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useSession } from '~/lib/auth-client'
const session = useSession()

const { postToWorker } = useSyncWorker()

onMounted(() => {
  postToWorker()
})

const getGreeting = () => {
  const now = new Date()
  const hours = now.getHours()

  return hours < 12
    ? 'Good Morning'
    : hours < 18
    ? 'Good Afternoon'
    : 'Good Evening'
}
</script>
