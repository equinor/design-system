import { TypographySize, TypographyTokenCollection } from './typography.types'

//@todo: can this be expressed in css i.e. calc(round(${$fontSize} * ${$lineHeightMultiplier}, 4px))
export const calculateLineHeight = ({
  fontSize,
  lineHeightMultiplier,
}: {
  fontSize: number
  lineHeightMultiplier: number
}): number => {
  return 4 * Math.round((fontSize * lineHeightMultiplier) / 4)
}

export const getTypographyProperties = ({
  tokens,
  size,
}: {
  tokens: TypographyTokenCollection
  size: TypographySize
}) => {
  const token = tokens[size]
  const lineHeight = calculateLineHeight({
    fontSize: token.fontSize,
    lineHeightMultiplier: token.lineHeightMultiplier,
  })

  return {
    fontSize: token.fontSize,
    lineHeight: lineHeight,
    fontSizeInRem: `${token.fontSize / 16}rem`,
    lineHeightInRem: `${lineHeight / 16}rem`,
    fontFamily: token.fontFamily,
    verticalOffset: token.verticalOffset,
  }
}
