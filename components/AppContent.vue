<template>
  <main
    ref="content"
    class="px-4 h-[calc(100vh_-_57px)] w-full pt-4 overflow-y-auto"
  >
    <div
      class="main-container xl:max-w-[960px] xl:min-w-[960px] max-w-full min-w-full mx-auto relative"
    >
      <slot :ref="el" />
    </div>
  </main>
</template>

<script setup>
const el = useTemplateRef('content')

provide('contentEl', el)
</script>
