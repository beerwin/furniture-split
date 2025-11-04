import type { ValidatorRule } from '../../../types/validation/ValidatorRule'

export const required = {
  name: 'required',
  condition: null,
  validate: (v: string | number | null) => {
    if (v === null) {
      return false
    }

    if (typeof v === 'undefined') {
      return false
    }

    if (typeof v === 'string' && v.length === 0) {
      return false
    }

    return true
  },
} as ValidatorRule<string | number>
