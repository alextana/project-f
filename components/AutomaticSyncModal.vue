<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()

const autoSync = ref(true)
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="`Opt auto automatic sync?`"
  >
    <template #body>
      <h2>
        This application automatically syncs your note to the cloud, if you'd
        like to disable this behaviour
      </h2>
      <USwitch class="mt-8" label="Enable auto sync" v-model="autoSync" />
    </template>
    <template #footer>
      <div class="flex gap-2 items-center w-full">
        <UButton
          icon="lucide-check"
          class="ml-auto cursor-pointer"
          label="Done"
          @click="emit('close', autoSync)"
        />
      </div>
    </template>
  </UModal>
</template>
