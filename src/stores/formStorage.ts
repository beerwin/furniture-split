import type { CutsFormContent } from '../types/cuts/cutsFormContent'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormStore = defineStore('formStorage', () => {
  const formList = ref<CutsFormContent[]>([])

  function loadItemList() {
    formList.value = JSON.parse(window.localStorage.getItem('cuts') ?? '[]') as CutsFormContent[]
  }

  function find(name: string): CutsFormContent | undefined {
    return formList.value.find((c) => c.formName === name)
  }

  function save(content: CutsFormContent): boolean {
    if (!find(content.formName)) {
      formList.value.push(content)
      window.localStorage.setItem('cuts', JSON.stringify(formList.value))
      return true
    }
    return false
  }

  function search(name: string) {
    return formList.value.filter((c) => c.formName.startsWith(name) || c.formName.includes('name'))
  }

  loadItemList()

  return { formList, loadItemList, find, save, search }
})
