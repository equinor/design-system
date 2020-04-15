import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { spacingsTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledAnchor = styled.div`
  position: relative;
  display: 'inline-block';
`

const StyledTooltip = styled.div`
  visibility: hidden;
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
  { className, title, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <StyledTooltip {...props}>
      <StyledTypography>{title}</StyledTypography>
    </StyledTooltip>
  )
})

Tooltip.displayName = 'eds-tooltip'

Tooltip.propTypes = {
  // Tooltip title
  title: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Tooltip.defaultProps = {
  title: '',
  className: '',
  children: null,
}
