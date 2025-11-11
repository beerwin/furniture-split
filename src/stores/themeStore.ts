import { defineStore } from "pinia"
import { ref } from "vue"

export const useThemeStore =  defineStore('theme', () => { 
  const theme = ref<'light' | 'dark' | 'system'>('system')

  const getSavedThemeSetting = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme
    }
    return 'system'
  }
  
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    if (newTheme === 'system') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    }

    localStorage.setItem('theme', newTheme)
  }

  return {
    theme,
    setTheme,
    getSavedThemeSetting
  }
});
