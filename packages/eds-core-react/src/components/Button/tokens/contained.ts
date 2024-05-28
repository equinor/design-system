import { tokens } from '@equinor/eds-tokens'
import { ButtonToken } from '../Button.types'
import { button } from './button'

import { mergeDeepRight } from 'ramda'

const {
  colors: {
    text: {
      static_icons__primary_white: { rgba: primaryWhite },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover: { rgba: primaryHoverColor },
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
    },
  },
  shape: {
    button: { borderRadius: buttonBorderRadius },
  },
} = tokens

export const primary = mergeDeepRight(button, {
  background: `var(--eds-color-surface-button-primary-filled, ${primaryColor})`,
  typography: {
    color: `var(--eds-color-text-button-primary-on-filled, ${primaryWhite})`,
  },
  border: {
    type: 'border',
    style: 'solid',
    width: '1px',
    color: `var(--eds-color-surface-button-primary-filled, ${primaryColor})`,
    radius: `var(--eds_button__radius, ${buttonBorderRadius})`,
  },
  states: {
    hover: {
      background: `var(--eds-color-surface-button-primary-filled-hover, ${primaryHoverColor})`,
    },
  },
}) as ButtonToken

export const secondary = mergeDeepRight(primary, {
  background: `var(--eds-color-surface-button-secondary-filled, ${secondaryColor})`,
  border: {
    color: `var(--eds-color-border-button-secondary-outlined, ${secondaryColor})`,
  },
  states: {
    hover: {
      background: `var(--eds-color-surface-button-secondary-filled-hover, ${secondaryHoverColor})`,
      border: {
        color: `var(--eds-color-border-button-secondary-outlined-hover, ${secondaryHoverColor})`,
      },
    },
  },
}) as ButtonToken

export const danger = mergeDeepRight(primary, {
  background: `var(--eds-color-surface-button-danger-filled, ${dangerColor})`,
  border: {
    color: `var(--eds-color-border-button-danger-outlined, ${dangerColor})`,
  },
  states: {
    hover: {
      background: `var(--eds-color-surface-button-danger-filled-hover, ${dangerHoverColor})`,
      border: {
        color: `var(--eds-color-border-button-danger-outlined-hover, ${dangerHoverColor})`,
      },
    },
  },
}) as ButtonToken
