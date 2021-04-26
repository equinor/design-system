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

export type DividerToken = ComponentToken

export type DividerVariantsToken = ComponentToken & {
  lighter: DividerToken
  light: DividerToken
  mediumColor: DividerToken
}

export const divider: DividerVariantsToken = {
  height: `${dividerHeight}px`,
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
  spacings: {
    top: spacingSmall,
    bottom: reduceValueByDividerHeight(spacingSmall),
  },
}

export const medium: DividerToken = {
  spacings: {
    top: spacingMedium,
    bottom: reduceValueByDividerHeight(spacingMedium),
  },
}
