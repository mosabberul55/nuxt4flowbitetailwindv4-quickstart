<script setup lang="ts">
const props = defineProps<{
  for?: string
  label?: string
}>()
</script>

<template>
  <label :for="props.for ? props.for : props.label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    <span v-if="props.label">{{ props.label }}</span>
    <span v-else><slot /></span>
  </label>
</template>

<style scoped>

</style>