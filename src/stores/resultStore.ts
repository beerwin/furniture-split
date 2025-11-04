import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useResultStore = defineStore('results', () => {
  const results = ref<string[]>([])

  function setResults(data: string[]) {
    results.value = data
  }

  return {
    results,
    setResults,
  }
})
