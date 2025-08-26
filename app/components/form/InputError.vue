<script setup lang="ts">
const props = defineProps<{
  message: undefined | string
}>()
</script>

<template>
  <p v-show="message" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ props.message }}</p>
</template>

<style scoped>

</style>