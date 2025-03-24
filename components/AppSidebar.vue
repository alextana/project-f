<template>
  <aside class="w-48 h-screen px-2 py-3">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-48"
    />
  </aside>
</template>
<script setup>
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
            console.log('New note selected')
          },
          icon: 'i-lucide-plus',
        },
        {
          label: 'My notes',
          description: 'See your existing notes',
          icon: 'i-lucide-notebook',
        },
      ],
    },
  ],
])
</script>
