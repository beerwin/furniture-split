import { type GetFieldType } from '@/types/forms/fieldType'

export function getValue<TData, TPath extends string, TDefault = GetFieldType<TData, TPath>>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault,
): GetFieldType<TData, TPath> | TDefault {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce<GetFieldType<TData, TPath>>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value, key) => (value as any)?.[key],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as any,
    )

  return value !== undefined ? value : (defaultValue as TDefault)
}
