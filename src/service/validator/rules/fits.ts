import type { Part } from '../../../types/cuts/part'
import type { ValidatorRule } from '../../../types/validation/ValidatorRule'

export const fits = {
  name: 'fits',
  condition: '',
  validate: (v: Part, condition: string) => {
    const conditions = condition.split('x') as string[]
    if (conditions.length !== 2) {
      throw new Error('Invalid argument: condition. The value should be [1-9]+x+[1-9]+')
    }
    const sheetLength = parseFloat(conditions[0] ?? '')
    const sheetWidth = parseFloat(conditions[1] ?? '')

    if (!v.canRotate && (v.width > sheetLength || v.height > sheetWidth)) {
      return false
    }

    if (v.canRotate && (v.width > sheetWidth || v.height > sheetLength)) {
      return false
    }

    return true
  },
} as ValidatorRule<Part | string>
