import type { ValidationInfo } from '../../types/validation/ValidationInfo'
import type { ErrorItem } from '../../types/validation/errorItem'

export const validator = (data: Map<string, ValidationInfo>) => {
  const errors: Map<string, ErrorItem> = new Map()

  data.forEach((field: ValidationInfo, key: string) => {
    const errorMessages: Map<string, string> = new Map()
    for (const rule of field.rules) {
      if (!rule.validate(field.data, rule.condition)) {
        errorMessages.set(
          rule.name,
          field.messages.get(rule.name) ?? `error_${rule.name}_condition_${rule.condition}`,
        )
      }
    }
    if (errorMessages.size > 0) {
      errors.set(key, errorMessages)
    }
  })

  return errors
}
