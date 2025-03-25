<template>
  <header
    class="w-screen py-3 px-4 border-b bg-slate-800/20 border-gray-700/40 shadow-md"
  >
    <div class="flex justify-between items-center">
      <NuxtLink to="/">Logo</NuxtLink>
      <div class="user-info flex items-center gap-2">
        <UAvatar
          v-if="session.data?.user?.image"
          :alt="session.data?.user?.name"
          :src="session.data?.user?.image || undefined"
          class="outline-2 outline-transparent hover:outline-primary-500 cursor-pointer"
        />
        <UIcon
          name="i-lucide-log-out"
          class="size-5 hover:text-primary-500 cursor-pointer"
          @click="signOut()"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { signOut, useSession } from '~/lib/auth-client'
const session = useSession()
</script>
