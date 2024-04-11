import { FontMetrics, metrics } from './metrics'
import { TypographySize, TypographyTokenCollection } from './typography.types'

export const calculateLineHeight = ({
  fontSize,
  lineHeightMultiplier,
}: {
  fontSize: number
  lineHeightMultiplier: number
}): number => {
  return 4 * Math.round((fontSize * lineHeightMultiplier) / 4)
}

function roundUpToNearest4(n: number) {
  return Math.ceil(n / 4) * 4
}

export const getTextBoxTrimValues = ({
  fontSize,
  lineHeight,
  fontMetrics,
}: {
  fontSize: number
  lineHeight: number
  fontMetrics: FontMetrics
}) => {
  const contentArea = fontMetrics.ascent + fontMetrics.descent
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm
  const descentScale = fontMetrics.descent / fontMetrics.unitsPerEm
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm
  const lineHeightScale = contentArea / fontMetrics.unitsPerEm

  const lineHeightNormal = fontSize * lineHeightScale
  const specifiedLineHeightOffset = (lineHeightNormal - lineHeight) / 2
  const capHeightTrim =
    (ascentScale - capHeightScale - specifiedLineHeightOffset / fontSize) *
    fontSize *
    -1
  const computedCapHeight = fontSize * capHeightScale
  const baselineTrim =
    (descentScale - specifiedLineHeightOffset / fontSize) * fontSize * -1
  const baselineTrimGrid =
    baselineTrim + roundUpToNearest4(computedCapHeight) - computedCapHeight

  return {
    contentArea,
    ascentScale,
    descentScale,
    capHeightScale,
    lineHeightScale,
    lineHeightNormal,
    specifiedLineHeightOffset,
    capHeightTrim,
    baselineTrim,
    baselineTrimGrid,
  }
}

export const formatTextBoxTrimValues = ({
  fontSize,
  capHeightTrim,
  baselineTrim,
  baselineTrimGrid,
}) => ({
  capHeightTrim: Math.round((capHeightTrim / fontSize) * 10000) / 10000,
  baselineTrim: Math.round((baselineTrim / fontSize) * 10000) / 10000,
  baselineTrimGrid: Math.round((baselineTrimGrid / fontSize) * 10000) / 10000,
})

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

  const textBoxTrimValues = getTextBoxTrimValues({
    fontSize: token.fontSize,
    lineHeight,
    fontMetrics: metrics[token.fontAlias],
  })

  const formattedTextBoxTrimValues = formatTextBoxTrimValues({
    fontSize: token.fontSize,
    capHeightTrim: textBoxTrimValues.capHeightTrim,
    baselineTrim: textBoxTrimValues.baselineTrim,
    baselineTrimGrid: textBoxTrimValues.baselineTrimGrid,
  })

  const trimValuesWithUnit = {
    capHeightTrimInEm: `${formattedTextBoxTrimValues.capHeightTrim}em`,
    baselineTrimInEm: `${formattedTextBoxTrimValues.baselineTrim}em`,
    baselineTrimGridInEm: `${formattedTextBoxTrimValues.baselineTrimGrid}em`,
  }

  return {
    fontSize: token.fontSize,
    lineHeight: lineHeight,
    ...textBoxTrimValues,
    fontSizeInRem: `${token.fontSize / 16}rem`,
    lineHeightInRem: `${lineHeight / 16}rem`,
    ...trimValuesWithUnit,
    fontFamily: token.fontFamily,
  }
}
