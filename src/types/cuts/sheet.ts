import type { PlacedRect } from './placedRect'

export interface Sheet {
  sheetWidth: number
  sheetHeight: number
  rects: PlacedRect[]
}
