// TODO: This should be imported from tokens when we have defined these font families

import { FontFamily, TypographyTokenCollection } from './typography.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const equinor: FontFamily = {
  fontFamily: 'Equinor, sans-serif',
  fontAlias: 'equinor',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter: FontFamily = {
  fontFamily: '"Inter", Arial, sans-serif',
  fontAlias: 'inter',
}

export const headingTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 37,
    lineHeightMultiplier: 1.1,
    color: '#000',
  },
  BASE: {
    ...inter,
    fontSize: 28,
    lineHeightMultiplier: 1.1,
    color: '#000',
  },
  SM: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.1,
    color: '#000',
  },
  XS: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.25,
    color: '#000',
  },
  '2XS': {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.25,
    color: '#000',
  },
  '3XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.25,
    color: '#000',
  },
}

export const uiTextTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  BASE: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  SM: {
    ...inter,
    fontSize: 14,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  XS: {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.125, // TODO: the line-height of this size should be calculated to 16px
    color: '#000',
  },
  '2XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  '3XS': {
    ...inter,
    fontSize: 9,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
}

export const bodyTextTokens: TypographyTokenCollection = {
  LG: {
    ...inter,
    fontSize: 21,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  BASE: {
    ...inter,
    fontSize: 16,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  SM: {
    ...inter,
    fontSize: 14,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  XS: {
    ...inter,
    fontSize: 12,
    lineHeightMultiplier: 1.125, // TODO: the line-height of this size should be calculated to 16px
    color: '#000',
  },
  '2XS': {
    ...inter,
    fontSize: 10.5,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
  '3XS': {
    ...inter,
    fontSize: 9,
    lineHeightMultiplier: 1.125,
    color: '#000',
  },
}
