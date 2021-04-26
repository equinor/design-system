import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: lighter },
      background__light: { rgba: light },
      background__medium: { rgba: mediumColor },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall, medium: spacingMedium },
  },
} = tokens

const dividerHeight = 1

const reduceByValue = (subtractValue: number) => (valueWithUnit: string) => {
  const valueAndUnit = valueWithUnit
    .split(/(\d+)/)
    .filter((val) => val.length > 0)

  return `${parseInt(valueAndUnit[0]) - subtractValue}` + valueAndUnit[1]
}

const reduceValueByDividerHeight = reduceByValue(dividerHeight)

type DividerToken = ComponentToken

type DividerVariantsToken = {
  lighter: DividerToken
  light: DividerToken
  mediumColor: DividerToken
}

export const baseDivider: DividerToken = {
  height: `${dividerHeight}px`,
}

export const divider: DividerVariantsToken = {
  lighter: {
    background: lighter,
  },
  light: {
    background: light,
  },
  mediumColor: {
    background: mediumColor,
  },
}

export const small: DividerToken = {
  ...baseDivider,
  spacings: {
    top: spacingSmall,
    bottom: reduceValueByDividerHeight(spacingSmall),
  },
}

export const medium: DividerToken = {
  ...baseDivider,
  spacings: {
    top: spacingMedium,
    bottom: reduceValueByDividerHeight(spacingMedium),
  },
}
