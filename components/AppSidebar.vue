<template>
  <aside class="relative w-[250px] h-screen px-2 py-2 bg-neutral-950/50">
    <header class="flex justify-between items-center">
      <NuxtLink to="/">
        <p class="font-extrabold italic p-1">notey</p>
      </NuxtLink>
      <UIcon
        name="lucide-square-pen"
        class="cursor-pointer text-gray-400 hover:text-primary-500 w-4 h-4"
        @click="createNote()"
      />
    </header>

    <div class="absolute right-5 top-5 z-10"></div>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-[230px] mt-1"
    />

    <footer class="absolute bottom-2 w-full">
      <div
        class="flex items-center gap-1 rounded-md"
        v-if="!session.isPending && session.data?.user?.id"
      >
        <UPopover>
          <div
            class="popover cursor-pointer flex items-center gap-2 w-max hover:bg-neutral-900 p-1 rounded-md"
          >
            <UAvatar
              size="xs"
              v-if="session.data?.user?.image"
              :alt="session.data?.user?.name"
              :src="session.data?.user?.image || undefined"
            />
            <h2 class="text-sm font-bold text-gray-400">
              {{ session.data?.user?.name || 'User' }}
            </h2>
          </div>
          <template #content>
            <div class="w-auto p-3 text-sm">
              <UButton type="button" @click="signOut()"> Sign out </UButton>
            </div>
          </template>
        </UPopover>
      </div>
      <div v-else>
        <UButton @click="login()" label="Login" size="xs" />
      </div>
    </footer>
  </aside>
</template>
<script setup>
import { signOut, useSession } from '~/lib/auth-client'
import { liveQuery } from 'dexie'
import { db } from '~/lib/dexie'
const session = useSession()

const { createNote } = useCreateNote()
const { socialSignIn } = useLogin()

const notes = useObservable(
  liveQuery(() => db.notes.orderBy('createdAt').reverse().limit(20).toArray())
)

const login = () =>
  socialSignIn('google', {
    callbackURL: '/login/success',
    errorCallbackURL: '/login/error',
    newUserCallbackURL: '/first-login',
  })

const items = computed(() => [
  [
    {
      label: 'Links',
      type: 'label',
    },
    ...(notes.value?.length
      ? [
          {
            label: 'Notes',
            icon: 'i-lucide-file-text',
            defaultOpen: true,
            children: notes.value?.map((note) => ({
              label: note.title || 'Untitled note',
              description: 'See your existing notes',
              icon: 'i-lucide-file',
              to: `/notes/${note.id}`,
            })),
          },
        ]
      : []),
  ],
])
</script>
