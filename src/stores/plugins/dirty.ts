import type { PiniaPluginContext } from 'pinia'
import 'pinia'

const dirtyStates: Map<string, boolean> = new Map()

export function storeDirty({ store }: PiniaPluginContext) {
  dirtyStates.set(store.$id, false)

  const isDirty = () => dirtyStates.get(store.$id) || false
  const setDirty = (value: boolean) => {
    dirtyStates.set(store.$id, value)
  }

  store.$subscribe(() => {
    dirtyStates.set(store.$id, true)
  })

  return {
    isDirty,
    setDirty,
  }
}
