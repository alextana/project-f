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

<style scoped>
.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
