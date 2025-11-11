import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type Part } from '../types/cuts/part'
import { v4 } from 'uuid'
import type { CutsFormContent } from '../types/cuts/cutsFormContent'
import { validator } from '../service/validator/validator'
import { required } from '../service/validator/rules/required'
import { fits } from '../service/validator/rules/fits'
import { min } from '../service/validator/rules/min'
import { ValidationInfo } from '../types/validation/ValidationInfo'
import { useLangaugeStore } from './language'

export const useCalculatorForm = defineStore('calculatorForm', () => {
  const sheetLength = ref(2440)
  const sheetWidth = ref(1220)
  const kerf = ref(3)
  const waste = ref(15)
  const sheetSizeSelection = ref('2440x1220')
  const parts = ref<Part[]>([])
  const formName = ref('')

  const languageStore = useLangaugeStore()

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

  function errorBag() {
    const validation = new Map([
    [
      'sheetLength',
      {
        data: sheetLength.value,
        rules: [
          required,
          {
            ...min,
            condition: 1,
          },
        ],
        messages: new Map([
          ['min', languageStore.getText('cuts.ErrorSheetLengthMustBePositive')],
          ['required', languageStore.getText('cuts.ErrorRequired')],
        ]),
      },
    ],
    [
      'sheetWidth',
      {
        data: sheetWidth.value,
        rules: [
          required,
          {
            ...min,
            condition: 1,
          },
        ],
        messages: new Map([
          ['min', languageStore.getText('cuts.ErrorSheetWidthMustBePositive')],
          ['required', languageStore.getText('cuts.ErrorRequired')],
        ]),
      },
    ],
    [
      'kerf',
      {
        data: kerf.value,
        rules: [
          required,
          {
            ...min,
            condition: 0,
          },
        ],
        messages: new Map([
          ['min', languageStore.getText('cuts.ErrorKerfSizeCantBeNegative')],
          ['required', languageStore.getText('cuts.ErrorRequired')],
        ]),
      },
    ],
    [
      'waste',
      {
        data: waste.value,
        rules: [
          required,
          {
            ...min,
            condition: 0,
          },
        ],
        messages: new Map([
          ['min', languageStore.getText('cuts.ErrorWasteCantBeNegative')],
          ['required', languageStore.getText('cuts.ErrorRequired')],
        ]),
      },
    ],
    [
      'parts',
      {
        data: parts.value,
        rules: [
          {
            ...min,
            condition: 1,
          },
        ],
        messages: new Map([['min', languageStore.getText('cuts.ErrorAtLeastOnePieceIsRequired')]]),
      },
    ],
  ]) as Map<string, ValidationInfo>

  for (const part in parts.value) {
    validation.set(`parts.${part}.name`, {
      data: parts.value[part]?.name,
      rules: [required],
      messages: new Map([['required', languageStore.getText('cuts.ErrorRequired')]]),
    } as ValidationInfo)

    validation.set(`parts.${part}.width`, {
      data: parts.value[part]?.width,
      rules: [
        required,
        {
          ...min,
          condition: 1,
        },
      ],
      messages: new Map([
        ['required', languageStore.getText('cuts.ErrorRequired')],
        [
          'min',
          languageStore.getText('cuts.ErrorPieceWidthMustbePositive', [
            parts.value[part]?.name ?? '',
          ]),
        ],
      ]),
    })

    validation.set(`parts.${part}.height`, {
      data: parts.value[part]?.height,
      rules: [
        required,
        {
          ...min,
          condition: 1,
        },
      ],
      messages: new Map([
        ['required', languageStore.getText('cuts.ErrorRequired')],
        [
          'min',
          languageStore.getText('cuts.ErrorPieceHeightMustBePositive', [
            parts.value[part]?.name ?? '',
          ]),
        ],
      ]),
    })

    validation.set(`parts.${part}`, {
      data: parts.value[part],
      rules: [
        required,
        {
          ...fits,
          condition: `${sheetLength.value - waste.value * 2}x${sheetWidth.value - waste.value * 2}`,
        },
      ],
      messages: new Map([
        [
          'fits',
          languageStore.getText('cuts.ErrorNoFitWithoutRotation', [parts.value[part]?.name ?? '']),
        ],
      ]),
    })
  }

  return validator(validation)
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
    errorBag,
  }
})
