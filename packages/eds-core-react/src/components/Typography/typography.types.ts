export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TypographyLineHeight = 'default' | 'squished'
export type TypographyElement = 'header' | 'ui-body-static'
export type TypographyFontWeight = 'bolder' | 'normal' | 'lighter'
export type TypographyLetterSpacing = 'loose' | 'normal' | 'tight'

export type TypographyProps = {
  /** affects font-size & line-height. Choose between presets  */
  size?: TypographySize
  lineHeight?: TypographyLineHeight
  fontWeight?: TypographyFontWeight
  letterSpacing?: TypographyLetterSpacing
}
