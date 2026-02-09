/**
 * Client-side button YAML generator
 * Generates Power Apps YAML with customizable properties
 */

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

export type ButtonYamlOptions = {
  name: string
  variant: ButtonVariant
  color: ButtonColor
  text: string
  disabled?: boolean
  // Layout
  width?: number
  height?: number
  x?: number
  y?: number
  // Style - Padding
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  // Style - Border
  borderRadius?: number
  borderThickness?: number
  // Style - Typography
  fontSize?: number
  // Interaction
  tooltip?: string
  onSelectAction?: string
}

const EDSColors = {
  primary: {
    resting: 'RGBA(0, 112, 121, 1)',
    hover: 'RGBA(0, 79, 85, 1)',
    disabled: 'RGBA(220, 220, 220, 1)',
  },
  secondary: {
    resting: 'RGBA(36, 55, 70, 1)',
    hover: 'RGBA(26, 42, 54, 1)',
    disabled: 'RGBA(220, 220, 220, 1)',
  },
  danger: {
    resting: 'RGBA(235, 0, 0, 1)',
    hover: 'RGBA(179, 0, 0, 1)',
    disabled: 'RGBA(220, 220, 220, 1)',
  },
}

const textColor = 'RGBA(255, 255, 255, 1)'
const disabledTextColor = 'RGBA(190, 190, 190, 1)'
const borderLight = 'RGBA(220, 220, 220, 1)'
const borderMedium = 'RGBA(220, 220, 220, 1)'

export const generateButtonYaml = (options: ButtonYamlOptions): string => {
  const {
    name,
    variant,
    color,
    text,
    disabled = false,
    width = 132,
    height = 36,
    x = 40,
    y = 40,
    paddingLeft = 16,
    paddingRight = 16,
    paddingTop = 0,
    paddingBottom = 0,
    borderRadius = 4,
    borderThickness = 1,
    fontSize = 10.5,
    tooltip = text,
    onSelectAction = `Notify("${text} clicked", NotificationType.Information)`,
  } = options

  const colorScheme = EDSColors[color]

  if (variant === 'contained') {
    const fillColor = disabled
      ? EDSColors.primary.disabled
      : colorScheme.resting
    const hoverFill = disabled ? EDSColors.primary.disabled : colorScheme.hover

    return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =${colorScheme.resting}
      BorderThickness: =0
      Color: =${disabled ? disabledTextColor : textColor}
      DisabledBorderColor: =${borderLight}
      DisabledColor: =${disabledTextColor}
      DisabledFill: =${EDSColors.primary.disabled}
      Fill: =${fillColor}
      FocusedBorderColor: =${colorScheme.resting}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =${hoverFill}
      HoverColor: =${disabled ? disabledTextColor : textColor}
      HoverFill: =${hoverFill}
      OnSelect: =${onSelectAction}
      PaddingBottom: =${paddingBottom}
      PaddingLeft: =${paddingLeft}
      PaddingRight: =${paddingRight}
      PaddingTop: =${paddingTop}
      PressedBorderColor: =${hoverFill}
      PressedColor: =${disabled ? disabledTextColor : textColor}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${borderRadius}
      RadiusBottomRight: =${borderRadius}
      RadiusTopLeft: =${borderRadius}
      RadiusTopRight: =${borderRadius}
      Size: =${fontSize}
      Text: ="${text}"
      Tooltip: ="${tooltip}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
  }

  if (variant === 'outlined') {
    const textColorValue = disabled ? disabledTextColor : colorScheme.resting
    const borderColor = disabled ? borderMedium : colorScheme.resting
    const hoverFill = 'RGBA(0, 112, 121, 0.1)'

    return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =${borderColor}
      BorderStyle: =BorderStyle.Solid
      BorderThickness: =${borderThickness}
      Color: =${textColorValue}
      DisabledBorderColor: =${borderMedium}
      DisabledColor: =${disabledTextColor}
      DisabledFill: =Color.Transparent
      Fill: =Color.Transparent
      FocusedBorderColor: =${colorScheme.resting}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =${disabled ? borderColor : colorScheme.hover}
      HoverColor: =${textColorValue}
      HoverFill: =${hoverFill}
      OnSelect: =${onSelectAction}
      PaddingBottom: =${paddingBottom}
      PaddingLeft: =${paddingLeft}
      PaddingRight: =${paddingRight}
      PaddingTop: =${paddingTop}
      PressedBorderColor: =${disabled ? borderColor : colorScheme.hover}
      PressedColor: =${textColorValue}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${borderRadius}
      RadiusBottomRight: =${borderRadius}
      RadiusTopLeft: =${borderRadius}
      RadiusTopRight: =${borderRadius}
      Size: =${fontSize}
      Text: ="${text}"
      Tooltip: ="${tooltip}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
  }

  // Ghost variant
  const textColorValue = disabled ? disabledTextColor : colorScheme.resting
  const hoverFill = 'RGBA(0, 112, 121, 0.1)'

  return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =Color.Transparent
      BorderStyle: =BorderStyle.None
      BorderThickness: =0
      Color: =${textColorValue}
      DisabledBorderColor: =Color.Transparent
      DisabledColor: =${disabledTextColor}
      DisabledFill: =Color.Transparent
      Fill: =Color.Transparent
      FocusedBorderColor: =${colorScheme.resting}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =Color.Transparent
      HoverColor: =${textColorValue}
      HoverFill: =${hoverFill}
      OnSelect: =${onSelectAction}
      PaddingBottom: =${paddingBottom}
      PaddingLeft: =${paddingLeft}
      PaddingRight: =${paddingRight}
      PaddingTop: =${paddingTop}
      PressedBorderColor: =Color.Transparent
      PressedColor: =${textColorValue}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${borderRadius}
      RadiusBottomRight: =${borderRadius}
      RadiusTopLeft: =${borderRadius}
      RadiusTopRight: =${borderRadius}
      Size: =${fontSize}
      Text: ="${text}"
      Tooltip: ="${tooltip}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
}
