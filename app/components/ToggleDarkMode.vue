<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDark = ref(false);

function applyTheme(theme: "light" | "dark" | "system") {
  if (theme === "system") {
    localStorage.removeItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
    isDark.value = prefersDark;
  } else {
    localStorage.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    isDark.value = theme === "dark";
  }
}

function toggleDark() {
  if (localStorage.theme === "dark") {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

onMounted(() => {
  // Initialize theme
  if (localStorage.theme === "dark") {
    applyTheme("dark");
  } else if (localStorage.theme === "light") {
    applyTheme("light");
  } else {
    applyTheme("system");
  }
});
</script>

<template>
  <button
      @click="toggleDark"
      class="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
  >
    {{ isDark ? "🌙 Dark" : "☀️ Light" }}
  </button>
</template>