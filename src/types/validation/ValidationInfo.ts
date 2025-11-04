import type { ValidatorRule } from './ValidatorRule'

export type ValidationInfo = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  rules: ValidatorRule<any>[]
  messages: Map<string, string>
}
