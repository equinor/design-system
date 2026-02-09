/**
 * Button Property Schema
 * Defines customizable properties for Power Apps buttons
 * Maps EDS React Button properties to Power Apps constraints
 */

export type PropertyType = 'text' | 'number' | 'select' | 'boolean'
export type PropertyCategory = 'content' | 'layout' | 'style' | 'interaction'

export type PropertyDefinition = {
  id: string
  label: string
  type: PropertyType
  category: PropertyCategory
  defaultValue: string | number | boolean
  description?: string
  options?: Array<{ value: string | number; label: string }>
  min?: number
  max?: number
  step?: number
  unit?: string
  powerAppsSupported: boolean
  edsToken?: string
}

export type ButtonProperties = {
  // Content
  text: string

  // Layout
  width: number
  height: number
  x: number
  y: number

  // Style - Padding
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number

  // Style - Border
  borderRadius: number
  borderThickness: number

  // Style - Typography
  fontSize: number

  // Interaction
  tooltip: string
  onSelectAction: string
}

export const buttonPropertySchema: PropertyDefinition[] = [
  // Content Category
  {
    id: 'text',
    label: 'Button Text',
    type: 'text',
    category: 'content',
    defaultValue: 'Button',
    description: 'The text displayed on the button',
    powerAppsSupported: true,
  },
  {
    id: 'tooltip',
    label: 'Tooltip',
    type: 'text',
    category: 'content',
    defaultValue: 'Button',
    description: 'Tooltip text shown on hover',
    powerAppsSupported: true,
  },

  // Layout Category
  {
    id: 'width',
    label: 'Width',
    type: 'number',
    category: 'layout',
    defaultValue: 132,
    description: 'Button width in pixels',
    min: 60,
    max: 500,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },
  {
    id: 'height',
    label: 'Height',
    type: 'number',
    category: 'layout',
    defaultValue: 36,
    description: 'Button height in pixels',
    min: 24,
    max: 100,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
    edsToken: 'Size: default = 36px',
  },
  {
    id: 'x',
    label: 'X Position',
    type: 'number',
    category: 'layout',
    defaultValue: 40,
    description: 'Horizontal position in canvas',
    min: 0,
    max: 2000,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },
  {
    id: 'y',
    label: 'Y Position',
    type: 'number',
    category: 'layout',
    defaultValue: 40,
    description: 'Vertical position in canvas',
    min: 0,
    max: 2000,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },

  // Style Category - Padding
  {
    id: 'paddingLeft',
    label: 'Padding Left',
    type: 'number',
    category: 'style',
    defaultValue: 16,
    description: 'Left padding in pixels',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
    edsToken: 'Spacing: medium = 16px',
  },
  {
    id: 'paddingRight',
    label: 'Padding Right',
    type: 'number',
    category: 'style',
    defaultValue: 16,
    description: 'Right padding in pixels',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
    edsToken: 'Spacing: medium = 16px',
  },
  {
    id: 'paddingTop',
    label: 'Padding Top',
    type: 'number',
    category: 'style',
    defaultValue: 0,
    description: 'Top padding in pixels',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },
  {
    id: 'paddingBottom',
    label: 'Padding Bottom',
    type: 'number',
    category: 'style',
    defaultValue: 0,
    description: 'Bottom padding in pixels',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },

  // Style Category - Border
  {
    id: 'borderRadius',
    label: 'Border Radius',
    type: 'number',
    category: 'style',
    defaultValue: 4,
    description: 'Corner radius in pixels',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
    edsToken: 'Border Radius: small = 4px',
  },
  {
    id: 'borderThickness',
    label: 'Border Thickness',
    type: 'number',
    category: 'style',
    defaultValue: 1,
    description: 'Border width in pixels (outlined variant)',
    min: 0,
    max: 5,
    step: 1,
    unit: 'px',
    powerAppsSupported: true,
  },

  // Style Category - Typography
  {
    id: 'fontSize',
    label: 'Font Size',
    type: 'number',
    category: 'style',
    defaultValue: 10.5,
    description: 'Text size (Power Apps scale: 10.5 ≈ 14px)',
    min: 8,
    max: 20,
    step: 0.5,
    unit: 'pt',
    powerAppsSupported: true,
    edsToken: 'Typography: button = 14px',
  },

  // Interaction Category
  {
    id: 'onSelectAction',
    label: 'On Click Action',
    type: 'text',
    category: 'interaction',
    defaultValue: 'Notify("Button clicked", NotificationType.Information)',
    description: 'PowerFx formula for button click',
    powerAppsSupported: true,
  },
]

export const getDefaultPropertyValues = (): ButtonProperties => {
  return buttonPropertySchema.reduce((acc, prop) => {
    acc[prop.id as keyof ButtonProperties] = prop.defaultValue as never
    return acc
  }, {} as ButtonProperties)
}

export const getPropertiesByCategory = (
  category: PropertyCategory,
): PropertyDefinition[] => {
  return buttonPropertySchema.filter((prop) => prop.category === category)
}
