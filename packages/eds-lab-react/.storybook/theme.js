import { create } from '@storybook/theming'

export const theme = create({
  base: 'light',

  // Typography
  fontBase: 'Equinor, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333',

  brandTitle: 'Equinor Design System - Core React',
  brandUrl: 'https://eds.equinor.com',
  brandImage:
    'https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#red',
})
