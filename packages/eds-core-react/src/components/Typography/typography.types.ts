export type TypographySize = '3XS' | '2XS' | 'XS' | 'SM' | 'BASE' | 'LG'
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type TypographyElement = HeadingElement | 'p' | 'span' | 'div' | 'a'

export type TypographyProps = {
  size?: TypographySize
  children?: React.ReactNode
  isGridVisible?: boolean
}

export type HeadingProps = TypographyProps & {
  as?: HeadingElement
}

export type UITextProps = TypographyProps & {
  as?: TypographyElement
}

export type BodyTextProps = UITextProps

export type FontFamily = {
  fontFamily: string
  fontAlias: 'inter' | 'equinor'
}

export type TypographyToken = FontFamily & {
  fontSize: number
  lineHeightMultiplier: number
  color?: string
}

export type TypographyTokenCollection = {
  LG: TypographyToken
  BASE: TypographyToken
  SM: TypographyToken
  XS: TypographyToken
  '2XS': TypographyToken
  '3XS': TypographyToken
}
