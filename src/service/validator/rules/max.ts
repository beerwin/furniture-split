import type { ValidatorRule } from '../../../types/validation/ValidatorRule'

export const max = {
  name: 'min',
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  validate: (v: any[] | number | string, condition: number) => {
    if (Array.isArray(v)) {
      return v.length <= condition
    }

    if (typeof v === 'string') {
      return v.length <= condition
    }

    return v <= condition
  },
} as ValidatorRule<[] | number | string>
