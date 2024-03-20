type FontFamily = {
  fontFamily: string
  fontAlias: 'inter' | 'equinor'
}

type FontToken = FontFamily & {
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

export const headingTokens: FontTokens = {
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
