import type { PiniaPluginContext } from 'pinia'
import 'pinia'

export function storeDirty({ store }: PiniaPluginContext) {
  // Set initial state
  store.$state.dirty = false

  // Add methods to the store
  const isDirty = () => store.$state.dirty
  const setDirty = (value: boolean) => {
    store.$state.dirty = value
  }

  // Subscribe to changes
  store.$subscribe(() => {
    store.$state.dirty = true
  })

  return {
    isDirty,
    setDirty,
  }
}
