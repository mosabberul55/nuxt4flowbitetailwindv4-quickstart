<script setup lang="ts">
import { useFlowbite } from '~/composables/useFlowbite';
import {initFlowbite} from "flowbite";
onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  });
});
</script>
<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
    <slot />
  </div>
</template>