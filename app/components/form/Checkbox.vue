<script setup lang="ts">
interface Options {
  label: string
  value: string
}
defineProps<{
  modelValue: string | number | undefined
  options: Options[]
  error?: undefined | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>()

const input = ref<null |string | number >(null)

</script>

<template>
  <div class="flex gap-2">
    <div v-for="option in options" class="flex items-center">
      <input
          ref="input"
          :id="option.value"
          type="checkbox"
          :value="option.value"
          :checked="modelValue === option.value"
          @input="$emit('update:modelValue', $event?.target?.value)"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label :for="option.value" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {{ option.label }}</label>
    </div>
  </div>
</template>

<style scoped>

</style>