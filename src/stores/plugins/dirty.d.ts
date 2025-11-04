import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties {
    dirty: boolean
  }

  export interface PiniaCustomProperties {
    isDirty: () => boolean
    setDirty: (value: boolean) => void
  }
}
