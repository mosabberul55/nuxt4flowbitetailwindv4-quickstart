<script setup lang="ts">
import {placeholder} from "@babel/types";

defineProps<{
  modelValue: string | number | undefined
  type: string
  error?: undefined | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>()

const input = ref<null |string | number >(null)

</script>

<template>
  <input
      ref="input"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event?.target?.value)"
      :class="[
       'bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5',
       'focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
       error ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' : 'border-gray-300'
     ]"
  />
</template>

<style scoped>

</style>