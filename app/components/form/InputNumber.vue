<script setup lang="ts">
defineProps<{
  modelValue: string | number | undefined;
  error?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <div class="absolute top-[7px] sm:top-[9px] left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
        <div>
          <span class="text-[12px] sm:text-[14px] text-slate-700">+88</span>
        </div>
      </div>
      <input
          type="tel"
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          :class="[
             'bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5',
             'focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
             error ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' : 'border-gray-300'
          ]"
          :placeholder="placeholder || '123-456-7890'"
          pattern="[0-9]*"
          inputmode="numeric"
          maxlength="11"
      />
    </div>
  </div>
</template>