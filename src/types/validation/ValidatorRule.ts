export type ValidatorRule<T> = {
  name: string
  condition: T | null | undefined
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  validate: (v: T | any[] | null | undefined, condition: T | null | undefined) => boolean
}
