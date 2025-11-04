import type { Part } from './part'

export type CutsFormContent = {
  formName: string
  sheetLength: number
  sheetWidth: number
  kerf: number
  waste: number
  sheetSizeSelection: string
  parts: Part[]
}
