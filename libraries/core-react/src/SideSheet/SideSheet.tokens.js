import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
      background__light: { rgba: borderColor },
    },
  },
  spacings: {
    comfortable: { xx_small: spacingXXS, medium: spacingMedium },
  },
} = tokens

const reduceByValue = (subtractValueWithUnit) => (valueWithUnit) => {
  // Padding width value only:
  const valueAndUnit = valueWithUnit
    .split(/(\d+)/)
    .filter((val) => val.length > 0)

  // Border width value only:
  const subtractValueAndUnit = subtractValueWithUnit
    .split(/(\d+)/)
    .filter((val) => val.length > 0)

  // return Padding - border + px:
  return valueAndUnit[0] - subtractValueAndUnit[0] + valueAndUnit[1]
}

const reduceValueByBorderWidth = reduceByValue(spacingXXS)
const topBarHeight = 64 // margin necessary for side sheet to appear under TopBar

export const sidesheet = {
  background,
  spacings: {
    left: reduceValueByBorderWidth(spacingMedium),
    right: spacingMedium,
    top: spacingMedium,
  },
  top: `${topBarHeight}px`,
  border: {
    left: { color: borderColor, width: spacingXXS },
  },
  small: {
    width: '240px',
  },
  medium: {
    width: '320px',
  },
  large: {
    width: '480px',
  },
  xlarge: {
    width: '640px',
  },
}
