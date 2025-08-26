<script setup lang="ts">
const authStore = useAuthStore()
await authStore.getLoggedUser()
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
