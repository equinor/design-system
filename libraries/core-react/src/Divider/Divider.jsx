import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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

const dividerTokens = {
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

const StyledDivider = styled.hr(
  ({ backgroundColor, marginTop, marginBottom, dividerHeight: height }) => ({
    backgroundColor,
    marginTop,
    marginBottom,
    height,
    border: 'none',
  }),
)

export const Divider = forwardRef(function Divider(
  { color, variant, className },
  ref,
) {
  const props = {
    backgroundColor: dividerTokens.color[color],
    marginTop: dividerTokens[variant].spacings.top,
    marginBottom: dividerTokens[variant].spacings.bottom,
    dividerHeight: dividerTokens.height,
  }

  return <StyledDivider {...props} className={className} ref={ref} />
})

Divider.displayName = 'eds-divider'

Divider.propTypes = {
  // Valid colors
  color: PropTypes.oneOf(['lighter', 'light', 'medium']),
  // Vertical spacing
  variant: PropTypes.oneOf(['small', 'medium']),
  /** @ignore */
  className: PropTypes.string,
}

Divider.defaultProps = {
  color: 'medium',
  variant: 'medium',
  className: '',
}
