type FontToken = {
  fontFamily: string
  fontAlias: 'inter' | 'equinor'
  fontSize: number
  lineHeightMultiplier: number
}

type FontTokens = {
  LG: FontToken
  BASE: FontToken
  SM: FontToken
  XS: FontToken
  '2XS': FontToken
  '3XS': FontToken
}

// TODO: This should be imported from tokens when we have defined these font families
export const headingTokens: FontTokens = {
  LG: {
    fontFamily: 'Equinor, sans-serif',
    fontAlias: 'equinor',
    fontSize: 37,
    lineHeightMultiplier: 1.1,
  },
  BASE: {
    fontFamily: 'Equinor, sans-serif',
    fontAlias: 'equinor',
    fontSize: 28,
    lineHeightMultiplier: 1.1,
  },
  SM: {
    fontFamily: 'Equinor, sans-serif',
    fontAlias: 'equinor',
    fontSize: 21,
    lineHeightMultiplier: 1.1,
  },
  XS: {
    fontFamily: '"Inter", Arial, sans-serif',
    fontAlias: 'inter',
    fontSize: 16,
    lineHeightMultiplier: 1.25,
  },
  '2XS': {
    fontFamily: '"Inter", Arial, sans-serif',
    fontAlias: 'inter',
    fontSize: 12,
    lineHeightMultiplier: 1.25,
  },
  '3XS': {
    fontFamily: '"Inter", Arial, sans-serif',
    fontAlias: 'inter',
    fontSize: 10.5,
    lineHeightMultiplier: 1.25,
  },
}
