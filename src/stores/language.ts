import { defineStore } from 'pinia'
import { ref } from 'vue'
import { lng as hu } from '../language/hu'
import { lng as en } from '../language/en'
import { getValue } from '../utils/getValue'

export const useLangaugeStore = defineStore('langauge', () => {
  const language = ref('en')
  const languageOptions = ref({
    en: 'English',
    hu: 'Magyar',
  })
  const texts = ref(en)

  function setLanguage(newLanguage: string) {
    switch (newLanguage) {
      default:
      case 'en':
        texts.value = en
        if (language.value !== 'en') {
          language.value = 'en'
        }
        break
      case 'hu':
        texts.value = hu
        if (language.value !== 'hu') {
          language.value = 'hu'
        }
        
        break
    }
  }

  function format(s: string, replacementValue: string | number): string {
    const v = typeof replacementValue === 'string' ? replacementValue : replacementValue.toString()
    return s.replace('%s', v)
  }

  function getText(
    key: string,
    replacementValues?: string | number | string[] | number[] | null | undefined,
  ): string {
    let s = getValue(texts.value, key) ?? key
    if (typeof replacementValues !== 'undefined' && replacementValues !== null) {
      if (Array.isArray(replacementValues)) {
        if (replacementValues.length > 0) {
          for (const x of replacementValues) {
            s = format(s, x)
          }
        }
      } else {
        s = format(s, replacementValues)
      }
    }

    return s
  }

  setLanguage('en')

  return {
    language,
    languageOptions,
    texts,
    setLanguage,
    getText,
  }
})
