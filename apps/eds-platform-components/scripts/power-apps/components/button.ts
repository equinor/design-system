/**
 * EDS Button Component Generator for Power Apps
 * Generates Power Apps YAML for EDS Button component
 */

import { EDSColors, EDSTypography, EDSShape } from '../utils/eds-tokens'

export type ButtonVariant = 'contained' | 'outlined' | 'ghost'
export type ButtonColor = 'primary' | 'secondary' | 'danger'

export type ButtonOptions = {
  name?: string
  variant?: ButtonVariant
  color?: ButtonColor
  text?: string
  disabled?: boolean
  width?: number
  height?: number
  x?: number
  y?: number
}

/**
 * Generates Power Apps YAML for EDS Button Component (Contained variant)
 */
export const generateContainedButton = (options: ButtonOptions): string => {
  const {
    name = 'EDSButton_Contained',
    color = 'primary',
    text = 'Button',
    disabled = false,
    width = 120,
    height = 36,
    x = 40,
    y = 40,
  } = options

  const colorScheme = EDSColors[color]
  const fillColor = disabled
    ? EDSColors.primary.disabled.powerFx
    : colorScheme.resting.powerFx
  const hoverFill = disabled
    ? EDSColors.primary.disabled.powerFx
    : colorScheme.hover.powerFx
  const textColor = EDSColors.text.staticIconsDefault.powerFx
  const disabledTextColor = EDSColors.text.disabled.powerFx

  return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =${colorScheme.resting.powerFx}
      BorderThickness: =0
      Color: =${disabled ? disabledTextColor : textColor}
      DisabledBorderColor: =${EDSColors.border.light.powerFx}
      DisabledColor: =${disabledTextColor}
      DisabledFill: =${EDSColors.primary.disabled.powerFx}
      Fill: =${fillColor}
      FocusedBorderColor: =${colorScheme.resting.powerFx}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =${hoverFill}
      HoverColor: =${disabled ? disabledTextColor : textColor}
      HoverFill: =${hoverFill}
      OnSelect: =Notify("${text} clicked", NotificationType.Information)
      PaddingBottom: =0
      PaddingLeft: =16
      PaddingRight: =16
      PaddingTop: =0
      PressedBorderColor: =${hoverFill}
      PressedColor: =${disabled ? disabledTextColor : textColor}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${EDSShape.borderRadius.small}
      RadiusBottomRight: =${EDSShape.borderRadius.small}
      RadiusTopLeft: =${EDSShape.borderRadius.small}
      RadiusTopRight: =${EDSShape.borderRadius.small}
      Size: =${EDSTypography.button.fontSize * 0.75}
      Text: ="${text}"
      Tooltip: ="${text}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
}

/**
 * Generates Power Apps YAML for EDS Button Component (Outlined variant)
 */
export const generateOutlinedButton = (options: ButtonOptions): string => {
  const {
    name = 'EDSButton_Outlined',
    color = 'primary',
    text = 'Button',
    disabled = false,
    width = 120,
    height = 36,
    x = 40,
    y = 40,
  } = options

  const colorScheme = EDSColors[color]
  const textColorValue = disabled
    ? EDSColors.text.disabled.powerFx
    : colorScheme.resting.powerFx
  const borderColor = disabled
    ? EDSColors.border.medium.powerFx
    : colorScheme.resting.powerFx
  const hoverFill = `RGBA(0, 112, 121, 0.1)` // 10% opacity of primary color

  return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =${borderColor}
      BorderStyle: =BorderStyle.Solid
      BorderThickness: =1
      Color: =${textColorValue}
      DisabledBorderColor: =${EDSColors.border.medium.powerFx}
      DisabledColor: =${EDSColors.text.disabled.powerFx}
      DisabledFill: =Color.Transparent
      Fill: =Color.Transparent
      FocusedBorderColor: =${colorScheme.resting.powerFx}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =${disabled ? borderColor : colorScheme.hover.powerFx}
      HoverColor: =${textColorValue}
      HoverFill: =${hoverFill}
      OnSelect: =Notify("${text} clicked", NotificationType.Information)
      PaddingBottom: =0
      PaddingLeft: =16
      PaddingRight: =16
      PaddingTop: =0
      PressedBorderColor: =${disabled ? borderColor : colorScheme.hover.powerFx}
      PressedColor: =${textColorValue}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${EDSShape.borderRadius.small}
      RadiusBottomRight: =${EDSShape.borderRadius.small}
      RadiusTopLeft: =${EDSShape.borderRadius.small}
      RadiusTopRight: =${EDSShape.borderRadius.small}
      Size: =${EDSTypography.button.fontSize * 0.75}
      Text: ="${text}"
      Tooltip: ="${text}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
}

/**
 * Generates Power Apps YAML for EDS Button Component (Ghost variant)
 */
export const generateGhostButton = (options: ButtonOptions): string => {
  const {
    name = 'EDSButton_Ghost',
    color = 'primary',
    text = 'Button',
    disabled = false,
    width = 120,
    height = 36,
    x = 40,
    y = 40,
  } = options

  const colorScheme = EDSColors[color]
  const textColorValue = disabled
    ? EDSColors.text.disabled.powerFx
    : colorScheme.resting.powerFx
  const hoverFill = `RGBA(0, 112, 121, 0.1)` // 10% opacity of primary color

  return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      BorderColor: =Color.Transparent
      BorderStyle: =BorderStyle.None
      BorderThickness: =0
      Color: =${textColorValue}
      DisabledBorderColor: =Color.Transparent
      DisabledColor: =${EDSColors.text.disabled.powerFx}
      DisabledFill: =Color.Transparent
      Fill: =Color.Transparent
      FocusedBorderColor: =${colorScheme.resting.powerFx}
      FocusedBorderThickness: =2
      Font: =Font.Lato
      Height: =${height}
      HoverBorderColor: =Color.Transparent
      HoverColor: =${textColorValue}
      HoverFill: =${hoverFill}
      OnSelect: =Notify("${text} clicked", NotificationType.Information)
      PaddingBottom: =0
      PaddingLeft: =16
      PaddingRight: =16
      PaddingTop: =0
      PressedBorderColor: =Color.Transparent
      PressedColor: =${textColorValue}
      PressedFill: =${hoverFill}
      RadiusBottomLeft: =${EDSShape.borderRadius.small}
      RadiusBottomRight: =${EDSShape.borderRadius.small}
      RadiusTopLeft: =${EDSShape.borderRadius.small}
      RadiusTopRight: =${EDSShape.borderRadius.small}
      Size: =${EDSTypography.button.fontSize * 0.75}
      Text: ="${text}"
      Tooltip: ="${text}"
      Width: =${width}
      X: =${x}
      Y: =${y}
`
}

/**
 * Main function to generate button component
 */
export const generateButton = (options: ButtonOptions): string => {
  const { variant = 'contained' } = options

  switch (variant) {
    case 'contained':
      return generateContainedButton(options)
    case 'outlined':
      return generateOutlinedButton(options)
    case 'ghost':
      return generateGhostButton(options)
    default:
      return generateContainedButton(options)
  }
}
