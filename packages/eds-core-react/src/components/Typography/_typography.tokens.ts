// TODO: This should be imported from tokens when we have defined these font families

import { FontFamily, TypographyTokenCollection } from './typography.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const equinor: FontFamily = {
  fontFamily: 'Equinor, sans-serif',
  fontAlias: 'equinor',
  verticalOffset: 0.06,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter: FontFamily = {
  fontFamily: '"Inter", Arial, sans-serif',
  fontAlias: 'inter',
  verticalOffset: 0.002,
}

export const headingTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 37,
    lineHeightMultiplier: 1.1,
  },
  BASE: {
    ...inter,
    fontSize: 28,
    lineHeightMultiplier: 1.1,
  },
  SM: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.1,
  },
  XS: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.25,
  },
  '2XS': {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.25,
  },
  '3XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.25,
  },
}

export const uiTextTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.125,
  },
  BASE: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.125,
  },
  SM: {
    ...inter,
    fontSize: 14,
    lineHeightMultiplier: 1.125,
  },
  XS: {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.125, // TODO: the line-height of this size should be calculated to 16px but is now 14px.
  },
  '2XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.125,
  },
  '3XS': {
    ...inter,
    fontSize: 9,
    lineHeightMultiplier: 1.125,
  },
}

export const bodyTextTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.5,
  },
  BASE: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.5,
  },
  SM: {
    ...inter,
    fontSize: 14,
    lineHeightMultiplier: 1.5,
  },
  XS: {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.5, // TODO: the line-height of this size should be calculated to 16px but is now 20px
  },
  '2XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.5,
  },
  '3XS': {
    ...inter,
    fontSize: 9,
    lineHeightMultiplier: 1.5, // TODO: the line-height of this size should be calculated to 28px but is now 24px
  },
}
