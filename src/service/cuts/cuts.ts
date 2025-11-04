import type { Part } from '../../types/cuts/part'
import type { PlacedRect } from '../../types/cuts/placedRect'
import type { Sheet } from '../../types/cuts/sheet'

interface Rect {
  name: string
  width: number
  height: number
  rotated: boolean
}

interface Position {
  x: number
  y: number
  rotated: boolean
}

class Node {
  x: number
  y: number
  width: number
  height: number
  used: boolean
  right: Node | null
  down: Node | null

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.used = false
    this.right = null
    this.down = null
  }

  insert(rect: Rect, kerf: number = 0): Position | null {
    if (this.used) {
      // Try to insert into children, but check for null children
      const rightResult = this.right ? this.right.insert(rect, kerf) : null
      if (rightResult) return rightResult
      const downResult = this.down ? this.down.insert(rect, kerf) : null
      if (downResult) return downResult
      return null
    } else if (rect.width <= this.width && rect.height <= this.height) {
      // Fits, split node
      this.used = true
      // Only add kerf to the right and down if not at the edge
      const rightKerf = this.x + rect.width < this.x + this.width ? kerf : 0
      const downKerf = this.y + rect.height < this.y + this.height ? kerf : 0
      this.down = new Node(
        this.x,
        this.y + rect.height + downKerf,
        this.width,
        this.height - rect.height - downKerf,
      )
      this.right = new Node(
        this.x + rect.width + rightKerf,
        this.y,
        this.width - rect.width - rightKerf,
        rect.height,
      )
      return { x: this.x, y: this.y, rotated: rect.rotated }
    } else {
      return null
    }
  }
}

// Packs rectangles into as few sheets as possible
// pieces: [{width, height}, ...]
// Returns: [{sheetWidth, sheetHeight, rects: [{x, y, width, height}]}]
export function pack(
  sheetHeight: number,
  sheetWidth: number,
  kerf: number,
  pieces: Part[],
): Sheet[] {
  // Sort pieces by area (largest first)
  const sorted = pieces.slice().sort((a, b) => b.height * b.width - a.height * a.width)
  const sheets: Sheet[] = []
  let remaining = sorted.slice()

  while (remaining.length > 0) {
    const root = new Node(0, 0, sheetWidth, sheetHeight)
    const placed: PlacedRect[] = []
    const notPlaced: Part[] = []

    for (const piece of remaining) {
      // Only add kerf between pieces, not at the edge
      let pos: Position | null = null
      let rotated = false
      // Try normal orientation first
      const rect: Rect = {
        name: piece.name,
        width: piece.width,
        height: piece.height,
        rotated: false,
      }
      pos = root.insert(rect, kerf)

      // If not placed and allowRotate, try rotated
      if (!pos && piece.canRotate) {
        const rectRot: Rect = {
          name: piece.name,
          width: piece.height,
          height: piece.width,
          rotated: true,
        }
        pos = root.insert(rectRot, kerf)
        rotated = !!pos
      }

      if (pos) {
        placed.push({
          name: piece.name,
          x: pos.x,
          y: pos.y,
          width: rotated ? piece.height : piece.width,
          height: rotated ? piece.width : piece.height,
          rotated: rotated,
        })
      } else {
        notPlaced.push(piece)
      }
    }

    sheets.push({
      sheetWidth,
      sheetHeight,
      rects: placed,
    })
    remaining = notPlaced
  }

  return sheets
}
