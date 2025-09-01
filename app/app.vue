<script setup lang="ts">
const authStore = useAuthStore()
await useAsyncData('getLoggedUser', async () => {
  try {
    await authStore.getLoggedUser()
    console.log('Fetched user:', authStore.user)
    return authStore.user
  } catch (e) {
    console.error('Error fetching user:', String(e))
    return null
  }
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
