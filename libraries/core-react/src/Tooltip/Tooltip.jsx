import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { spacingsTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledTooltip = styled.div`
  visibility: hidden;
  width: auto;
  background: ${({ background }) => background};
  text-align: center;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;

  ${spacingsTemplate(tokens.spacings)}
`
const StyledTypography = styled(Typography)`
  color: #fff;
`

export const Tooltip = forwardRef(function Tooltip(
  { className, children, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <StyledTooltip {...props}>
      <StyledTypography>{children}</StyledTypography>
    </StyledTooltip>
  )
})

Tooltip.displayName = 'eds-tooltip'

Tooltip.propTypes = {
  // Valid colors
  color: PropTypes.oneOf(['lighter', 'light', 'medium']),
  // Vertical spacing
  variant: PropTypes.oneOf(['small', 'medium']),
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Tooltip.defaultProps = {
  color: 'medium',
  variant: 'medium',
  className: '',
  children: null,
}
