export type TypographySize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
export type TypographyLineHeight = 'default' | 'squished'
export type TypographyElement = 'header' | 'ui-body'
export type TypographyFontWeight = 'bolder' | 'normal' | 'lighter'
export type TypographyLetterSpacing = 'loose' | 'normal' | 'tight'

export type TypographyProps = {
  size?: TypographySize
  lineHeight?: TypographyLineHeight
  fontWeight?: TypographyFontWeight
  letterSpacing?: TypographyLetterSpacing
}
