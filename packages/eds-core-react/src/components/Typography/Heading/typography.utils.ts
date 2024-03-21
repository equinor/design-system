import { FontMetrics } from '../metrics'

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
  const baselineTrim =
    (descentScale - specifiedLineHeightOffset / fontSize) * fontSize * -1
  const baselineTrimGrid =
    baselineTrim + roundUpToNearest4(lineHeightNormal) - lineHeightNormal

  return {
    contentArea,
    ascentScale,
    descentScale,
    capHeightScale,
    lineHeightScale,
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
