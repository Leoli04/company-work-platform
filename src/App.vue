<template>
  <div class="app-container" :style="themeStyle">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const themeStyle = computed(() => ({
  '--primary': themeStore.currentTheme.primary,
  '--secondary': themeStore.currentTheme.secondary,
  '--bg-gradient': themeStore.currentTheme.background,
  '--card-bg': themeStore.currentTheme.cardBg,
  '--card-text': themeStore.currentTheme.cardText,
  '--text-color': themeStore.currentTheme.textColor,
  '--text-secondary': themeStore.currentTheme.textSecondary
}))
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}

.app-container {
  min-height: 100vh;
  background: var(--bg-gradient);
  transition: background 0.3s ease;
}
</style>
