<template>
  <aside class="w-[250px] h-[calc(100vh_-_57px)] px-2 py-3 bg-neutral-950/50">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-[230px]"
    />
  </aside>
</template>
<script setup>
const { createNote } = useCreateNote()

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
