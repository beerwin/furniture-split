import type { PlacedRect } from '../types/cuts/placedRect'
import type { Sheet } from '../types/cuts/sheet'

const SVG_NS = 'http://www.w3.org/2000/svg'

type ItemRenderCallback = (imgElement: HTMLImageElement) => void

const svgToString = (svg: SVGSVGElement): string => {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString)
}

const addRotateIcon = (svg: SVGSVGElement, x: number, y: number, size: number): void => {
  const textElement = document.createElementNS(SVG_NS, 'text')
  textElement.setAttribute('x', x.toString())
  textElement.setAttribute('y', y.toString())
  textElement.setAttribute('font-size', size.toString())
  textElement.setAttribute('font-family', 'sans-serif')
  textElement.setAttribute('fill', '#000000')
  textElement.textContent = '↻'
  svg.appendChild(textElement)
}

const addtextElement = (
  svg: SVGSVGElement,
  x: number,
  y: number,
  size: number,
  text: string,
): void => {
  const textElement = document.createElementNS(SVG_NS, 'text')
  textElement.setAttribute('x', x.toString())
  textElement.setAttribute('y', y.toString())
  textElement.setAttribute('font-size', size.toString())
  textElement.setAttribute('font-family', 'sans-serif')
  textElement.setAttribute('fill', '#000000')
  textElement.textContent = text
  svg.appendChild(textElement)
}

const getBackgroundColor = (rotated: boolean, custom: string | false): string => {
  if (custom) {
    return custom
  }

  return rotated ? '#90cdf4' : '#f6ad55'
}

const addRectElement = (
  svg: SVGSVGElement,
  x: number,
  y: number,
  width: number,
  height: number,
  kerfSize: number,
  rotated: boolean,
  customBgColor: string | false = false,
  includesKerf: boolean = false,
): void => {
  const rectElement = document.createElementNS(SVG_NS, 'rect')
  rectElement.setAttribute('x', x.toString())
  rectElement.setAttribute('y', y.toString())
  rectElement.setAttribute('width', (width + (includesKerf ? 0 : kerfSize)).toString())
  rectElement.setAttribute('height', (height + (includesKerf ? 0 : kerfSize)).toString())
  rectElement.setAttribute('fill', getBackgroundColor(rotated, customBgColor))
  rectElement.setAttribute('stroke', '#FF1100')
  rectElement.setAttribute('stroke-width', kerfSize.toString())
  rectElement.setAttribute('fill-opacity', '0.5')
  rectElement.setAttribute('stroke-position', 'inside')
  svg.appendChild(rectElement)
}

const renderSingleItem = (
  sheetHeight: number,
  kerfSize: number,
  waste: number,
  rect: PlacedRect,
  svg: SVGSVGElement,
): void => {
  const textHeight = Math.round(sheetHeight / 20)
  addRectElement(
    svg,
    rect.x + waste,
    rect.y + waste,
    rect.width,
    rect.height,
    kerfSize,
    rect.rotated,
  )
  addtextElement(
    svg,
    rect.x + waste + 5,
    rect.y + waste + 15 + textHeight / 2,
    textHeight,
    `${rect.width} x ${rect.height}`,
  )
  addtextElement(
    svg,
    rect.x + waste + 5,
    rect.y + waste + textHeight * 2,
    textHeight,
    rect.name || '',
  )

  if (rect.rotated) {
    addRotateIcon(
      svg,
      rect.x + waste + rect.width - waste - textHeight,
      rect.y + waste + rect.height - waste - 5,
      textHeight,
    )
  }
}

export const renderSVG = (
  sheetWidth: number,
  sheetHeight: number,
  kerfSize: number,
  waste: number,
  sheets: Sheet[],
): string[] => {
  const svgs: string[] = []
  sheets.forEach((sheet) => {
    const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement
    svg.setAttribute('width', sheetWidth.toString())
    svg.setAttribute('height', sheetHeight.toString())
    svg.setAttribute('viewBox', `0 0 ${sheetWidth} ${sheetHeight}`)
    svg.setAttribute('xmlns', SVG_NS)
    sheet.rects.forEach((rect) => {
      renderSingleItem(sheetHeight, kerfSize, waste, rect, svg)
    })
    addRectElement(svg, 0, 0, sheetWidth, waste, kerfSize, false, '#cccccc', true)
    addRectElement(svg, 0, waste, waste, sheetHeight - waste, kerfSize, false, '#cccccc', true)
    addRectElement(
      svg,
      waste,
      sheetHeight - waste,
      sheetWidth - waste,
      waste,
      kerfSize,
      false,
      '#cccccc',
      true,
    )
    addRectElement(
      svg,
      sheetWidth - waste,
      waste,
      waste,
      sheetHeight - waste * 2,
      kerfSize,
      false,
      '#cccccc',
      true,
    )
    svgs.push(svgToString(svg))
  })

  return svgs
}

export const render = (
  parentElement: HTMLElement,
  sheetWidth: number,
  sheetHeight: number,
  kerfSize: number,
  waste: number,
  sheets: Sheet[],
  itemRender: ItemRenderCallback | null = null,
): void => {
  const svgs = renderSVG(sheetWidth, sheetHeight, kerfSize, waste, sheets)
  svgs.forEach((svg, index) => {
    const imgElement = document.createElement('img')
    imgElement.alt = `Sheet ${index + 1}`
    imgElement.src = svg
    if (itemRender && typeof itemRender === 'function') {
      itemRender(imgElement)
    }
    parentElement.appendChild(imgElement)
  })
}
