import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'

const { colors: colors_, spacings: spacings_ } = tokens

const dividerTokens = {
  height: '1px',
  color: {
    lighter: colors_.ui.background__default.hex,
    light: colors_.ui.background__light.hex,
    medium: colors_.ui.background__medium.hex,
  },
  small: {
    spacings: {
      top: spacings_.small,
      bottom: spacings_.small,
    },
  },
  medium: {
    spacings: {
      top: spacings_.medium,
      bottom: spacings_.medium,
    },
  },
}

const StyledDivider = styled.hr`
  margin-top: ${(props) => props.spacingTop};
  margin-bottom: ${(props) => props.spacingBottom};
  border: none;
  background-color: ${(props) => props.backgroundColor};
  height: 1px;
`

export const Divider = forwardRef(function Divider({ color, variant }, ref) {
  const props = {
    backgroundColor: dividerTokens.color[color],
    spacingTop: dividerTokens[variant].spacings.top,
    spacingBottom: dividerTokens[variant].spacings.bottom,
  }

  return <StyledDivider {...props} ref={ref} role="presentation" />
})

Divider.displayName = 'eds-divider'

Divider.propTypes = {
  // Valid colors
  color: PropTypes.oneOf(['lighter', 'light', 'medium']),
  // Vertical spacing
  variant: PropTypes.oneOf(['small', 'medium']),
}

Divider.defaultProps = {
  color: 'medium',
  variant: 'medium',
}
