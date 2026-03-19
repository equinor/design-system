import type { IconData } from '@equinor/eds-icons'

export type PropertyDefinition = {
  id: string
  label: string
  type: 'text' | 'number' | 'color' | 'boolean'
  category: 'content' | 'layout' | 'style' | 'interaction'
  defaultValue: string | number | boolean
  powerAppsSupported: boolean
  edsToken?: string
  description?: string
  min?: number
  max?: number
}

export type IconProperties = {
  iconData?: IconData
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

export const iconPropertySchema: PropertyDefinition[] = [
  // Content properties
  {
    id: 'tooltip',
    label: 'Tooltip',
    type: 'text',
    category: 'content',
    defaultValue: '',
    powerAppsSupported: true,
    description: 'Tooltip text shown on hover',
  },

  // Layout properties
  {
    id: 'width',
    label: 'Width',
    type: 'number',
    category: 'layout',
    defaultValue: 48,
    powerAppsSupported: true,
    edsToken: 'Size: default icon size in Power Apps',
    min: 16,
    max: 200,
  },
  {
    id: 'height',
    label: 'Height',
    type: 'number',
    category: 'layout',
    defaultValue: 48,
    powerAppsSupported: true,
    edsToken: 'Size: default icon size in Power Apps',
    min: 16,
    max: 200,
  },
  {
    id: 'x',
    label: 'X Position',
    type: 'number',
    category: 'layout',
    defaultValue: 40,
    powerAppsSupported: true,
    min: 0,
    max: 2000,
  },
  {
    id: 'y',
    label: 'Y Position',
    type: 'number',
    category: 'layout',
    defaultValue: 40,
    powerAppsSupported: true,
    min: 0,
    max: 2000,
  },

  // Style properties
  {
    id: 'color',
    label: 'Icon Color',
    type: 'color',
    category: 'style',
    defaultValue: '#007079',
    powerAppsSupported: true,
    edsToken: 'Color: --eds-color-primary',
    description: 'Fill color for the icon',
  },
  {
    id: 'borderColor',
    label: 'Border Color',
    type: 'color',
    category: 'style',
    defaultValue: 'transparent',
    powerAppsSupported: true,
    description: 'Border color around the icon',
  },
  {
    id: 'borderThickness',
    label: 'Border Thickness',
    type: 'number',
    category: 'style',
    defaultValue: 0,
    powerAppsSupported: true,
    min: 0,
    max: 10,
  },

  // Interaction properties
  {
    id: 'onSelectAction',
    label: 'OnSelect Action',
    type: 'text',
    category: 'interaction',
    defaultValue: '',
    powerAppsSupported: true,
    description: 'Power Apps formula to execute when icon is clicked',
  },
]

export const getDefaultPropertyValues = (): Omit<
  IconProperties,
  'iconData'
> => {
  return iconPropertySchema.reduce(
    (acc, prop) => ({
      ...acc,
      [prop.id]: prop.defaultValue,
    }),
    {} as Omit<IconProperties, 'iconData'>,
  )
}
