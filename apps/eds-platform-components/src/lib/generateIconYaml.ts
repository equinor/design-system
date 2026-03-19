import type { IconData } from '@equinor/eds-icons'

export type IconYamlOptions = {
  name: string
  iconData: IconData
  color?: string
  width?: number
  height?: number
  x?: number
  y?: number
  tooltip?: string
  onSelectAction?: string
  borderColor?: string
  borderThickness?: number
  disabled?: boolean
}

/**
 * Converts IconData to a URL-encoded SVG data URI for Power Apps
 */
export const iconDataToSvgDataUri = (
  iconData: IconData,
  color: string = '#007079',
): string => {
  const { width, height, svgPathData } = iconData

  // Handle both single path and array of paths
  const pathElements = Array.isArray(svgPathData)
    ? svgPathData.map((path) => `<path fill='${color}' d='${path}'/>`).join('')
    : `<path fill='${color}' fill-rule='evenodd' clip-rule='evenodd' d='${svgPathData}'/>`

  const svg = `<svg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'><g>${pathElements}</g></svg>`

  // URL encode the SVG
  const encoded = encodeURIComponent(svg)

  return `data:image/svg+xml,${encoded}`
}

/**
 * Converts hex color to Power Apps RGBA format
 */
const hexToRgba = (hex: string, opacity: number = 1): string => {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `RGBA(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Generates Power Apps YAML for an icon component
 */
export const generateIconYaml = (options: IconYamlOptions): string => {
  const {
    name,
    iconData,
    color = '#007079',
    width = 48,
    height = 48,
    x = 40,
    y = 40,
    tooltip = '',
    onSelectAction = '',
    borderColor = 'transparent',
    borderThickness = 0,
    disabled = false,
  } = options

  const imageDataUri = iconDataToSvgDataUri(iconData, color)
  const borderColorRgba =
    borderColor === 'transparent'
      ? 'RGBA(0, 0, 0, 0)'
      : hexToRgba(borderColor)

  const lines: string[] = [`- ${name}:`, `    Control: Image@2.2.3`, `    Properties:`]

  // Add border color if not transparent
  if (borderThickness > 0) {
    lines.push(`      BorderColor: =${borderColorRgba}`)
    lines.push(`      BorderThickness: =${borderThickness}`)
  }

  // Add disabled state
  if (disabled) {
    lines.push(`      DisplayMode: =DisplayMode.Disabled`)
  }

  // Add dimensions
  lines.push(`      Height: =${height}`)
  lines.push(`      Width: =${width}`)

  // Add position
  lines.push(`      X: =${x}`)
  lines.push(`      Y: =${y}`)

  // Add the SVG image data
  lines.push(`      Image: ="${imageDataUri}"`)

  // Add tooltip if provided
  if (tooltip) {
    lines.push(`      Tooltip: ="${tooltip}"`)
  }

  // Add OnSelect action if provided
  if (onSelectAction) {
    lines.push(`      OnSelect: =${onSelectAction}`)
  }

  return lines.join('\n')
}
