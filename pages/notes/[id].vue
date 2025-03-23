<template>
  <h1>Note {{ route.params.id }}</h1>
</template>
<script setup lang="ts">
const route = useRoute()

console.log(route.params.id)
</script>
