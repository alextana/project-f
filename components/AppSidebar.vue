<template>
  <aside
    class="relative w-[250px] h-[calc(100vh_-_57px)] px-2 py-3 bg-neutral-950/50"
  >
    <header class="flex justify-between items-center">
      <div
        class="flex items-center gap-1 hover:bg-neutral-900 pr-2 rounded-md hover:text-white"
        v-if="!session.isPending && session.data?.user?.id"
      >
        <UPopover>
          <div class="popover cursor-pointer flex items-center gap-2">
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
            <div class="w-30 p-3 text-sm">
              <button
                type="button"
                @click="signOut()"
                class="px-3 py-1 cursor-pointer hover:bg-neutral-800 rounded-md"
              >
                Sign out
              </button>
            </div>
          </template>
        </UPopover>
      </div>
      <div v-else>
        <UButton
          class="cursor-pointer bg-neutral-800 text-white hover:bg-neutral-900"
          @click="login()"
          label="Login"
          size="xs"
        />
      </div>
      <UIcon
        name="lucide-square-pen"
        class="cursor-pointer text-gray-400 hover:text-primary-500 w-4 h-4"
      />
    </header>

    <div class="absolute right-5 top-5 z-10"></div>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-[230px] mt-1"
    />
  </aside>
</template>
<script setup>
import { signOut, useSession } from '~/lib/auth-client'
const session = useSession()

const { createNote } = useCreateNote()
const { socialSignIn } = useLogin()

const login = () =>
  socialSignIn('google', {
    callbackURL: '/notes/logged-in',
    errorCallbackURL: '/login/error',
    newUserCallbackURL: '/first-login',
  })
const items = ref([
  [
    {
      label: 'Links',
      type: 'label',
    },
    {
      label: 'Notes',
      icon: 'i-lucide-file-text',
      defaultOpen: true,
      children: [
        {
          label: 'New note',
          description: 'Add a new note',
          onSelect: () => {
            createNote()
          },
          icon: 'i-lucide-plus',
        },
        {
          label: 'My notes',
          description: 'See your existing notes',
          icon: 'i-lucide-notebook',
          to: '/notes',
        },
      ],
    },
  ],
])
</script>
