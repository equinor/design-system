import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { hex: lighter },
      background__light: { hex: light },
      background__medium: { hex: medium },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall, medium: spacingMedium },
  },
} = tokens

const dividerHeight = 1

const reduceByValue = (subtractValue) => (valueWithUnit) => {
  const valueAndUnit = valueWithUnit
    .split(/(\d+)/)
    .filter((val) => val.length > 0)

  return valueAndUnit[0] - subtractValue + valueAndUnit[1]
}

const reduceValueByDividerHeight = reduceByValue(dividerHeight)

export const divider = {
  height: `${dividerHeight}px`,
  color: {
    lighter,
    light,
    medium,
  },
  small: {
    spacings: {
      top: spacingSmall,
      bottom: reduceValueByDividerHeight(spacingSmall),
    },
  },
  medium: {
    spacings: {
      top: spacingMedium,
      bottom: reduceValueByDividerHeight(spacingMedium),
    },
  },
}
