<template>
  <main ref="content" class="px-4 h-screen w-full pt-12 pb-24 overflow-y-auto">
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
