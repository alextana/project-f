<template>
  <aside
    class="w-[250px] h-screen bg-stone-900 border-r border-r-stone-800 text-gray-300 py-3 px-2"
  >
    <div class="flex w-full justify-center">
      <Menu
        :model="items"
        class="w-full text-sm"
        pt:root:class="border-0 bg-transparent"
      >
        <template #start>
          <div class="logo mb-3">project-f</div>
        </template>
        <template #item="{ item, props }">
          <NuxtLink
            :href="item.url"
            v-ripple
            exact-active-class="text-white"
            class="flex items-center py-1 font-semibold text-gray-400 hover:text-white"
            v-bind="props.action"
          >
            <span :class="`${item.icon} text-xs `" />
            <span class="">{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs"
              >{{ item.shortcut }}</span
            >
          </NuxtLink>
        </template>
      </Menu>
    </div>
  </aside>
</template>

<script setup>
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'

import { ref } from 'vue'

const items = ref([
  {
    label: null,
    items: [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        url: '/',
      },
    ],
  },
  {
    label: 'Notes',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
        url: '/notes/new-note',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      },
    ],
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
      },
    ],
  },
])
</script>
