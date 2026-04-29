import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const THEME_KEY = 'fuma_work_platform_theme'

export const useThemeStore = defineStore('theme', () => {
  // 主题定义
  const themes = {
    normal: {
      name: '正常',
      primary: '#667eea',
      secondary: '#764ba2',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardText: '#303133',
      textColor: '#fff',
      textSecondary: 'rgba(255, 255, 255, 0.7)'
    },
    eyeCare: {
      name: '护眼',
      primary: '#5D9B9B',
      secondary: '#84A98C',
      background: 'linear-gradient(135deg, #84A98C 0%, #52796F 100%)',
      cardBg: 'rgba(245, 240, 230, 0.95)',
      cardText: '#4A4A4A',
      textColor: '#3D3D3D',
      textSecondary: 'rgba(61, 61, 61, 0.6)'
    },
    dark: {
      name: '暗黑',
      primary: '#1a1a2e',
      secondary: '#16213e',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      cardBg: 'rgba(30, 30, 50, 0.95)',
      cardText: '#E0E0E0',
      textColor: '#E0E0E0',
      textSecondary: 'rgba(224, 224, 224, 0.6)'
    }
  }

  // 从本地存储加载主题
  function loadTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      return stored && themes[stored] ? stored : 'normal'
    } catch {
      return 'normal'
    }
  }

  const currentThemeKey = ref(loadTheme())

  const currentTheme = computed(() => themes[currentThemeKey.value])

  // 保存主题到本地存储
  function setTheme(themeKey) {
    if (themes[themeKey]) {
      currentThemeKey.value = themeKey
      localStorage.setItem(THEME_KEY, themeKey)
    }
  }

  // 监听主题变化
  watch(currentThemeKey, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  return {
    themes,
    currentThemeKey,
    currentTheme,
    setTheme
  }
})
