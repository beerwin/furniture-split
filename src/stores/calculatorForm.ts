import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type Part } from '../types/cuts/part'
import { v4 } from 'uuid'
import type { CutsFormContent } from '../types/cuts/cutsFormContent'

export const useCalculatorForm = defineStore('calculatorForm', () => {
  const sheetLength = ref(2440)
  const sheetWidth = ref(1220)
  const kerf = ref(3)
  const waste = ref(15)
  const sheetSizeSelection = ref('2440x1220')
  const parts = ref<Part[]>([])
  const formName = ref('')

  function addPart() {
    const part: Part = {
      id: v4(),
      name: '',
      width: 0,
      height: 0,
      canRotate: false,
    }
    parts.value.push(part)
  }

  function removePart(part: Part) {
    parts.value = parts.value.filter((p: Part) => p !== part)
  }

  function updateSheetSizes(length: number, width: number) {
    sheetLength.value = length
    sheetWidth.value = width
  }

  function toFileContent(): CutsFormContent {
    return {
      formName: formName.value,
      sheetLength: sheetLength.value,
      sheetWidth: sheetWidth.value,
      sheetSizeSelection: sheetSizeSelection.value,
      kerf: kerf.value,
      waste: waste.value,
      parts: parts.value,
    } as CutsFormContent
  }

  function fromFileContent(data: CutsFormContent) {
    formName.value = data.formName
    sheetLength.value = data.sheetLength
    sheetWidth.value = data.sheetWidth
    sheetSizeSelection.value = data.sheetSizeSelection
    kerf.value = data.kerf
    waste.value = data.waste
    parts.value = data.parts
  }

  function setFormName(name: string) {
    formName.value = name
  }

  function reset() {
    parts.value = [] as Part[]
    sheetSizeSelection.value = '2440x1220'
    kerf.value = 3
    waste.value = 16
    formName.value = ''
  }

  return {
    sheetLength,
    sheetWidth,
    sheetSizeSelection,
    kerf,
    waste,
    parts,
    formName,
    addPart,
    removePart,
    updateSheetSizes,
    toFileContent,
    fromFileContent,
    setFormName,
    reset,
  }
})
