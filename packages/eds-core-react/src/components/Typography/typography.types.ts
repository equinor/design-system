export type TypographySize = '3XS' | '2XS' | 'XS' | 'SM' | 'BASE' | 'LG'

export type TypographyProps = {
  /** affects font-size & line-height. Choose between presets  */
  size?: TypographySize
}

export type FontFamily = {
  fontFamily: string
  fontAlias: 'inter' | 'equinor'
  verticalOffset: number
}

export type TypographyToken = FontFamily & {
  fontSize: number
  lineHeightMultiplier: number
}

export type TypographyTokenCollection = {
  LG: TypographyToken
  BASE: TypographyToken
  SM: TypographyToken
  XS: TypographyToken
  '2XS': TypographyToken
  '3XS': TypographyToken
}
