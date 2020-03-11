import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

const StyledSideSheet = styled.div`
  border-left: 2px solid #f7f7f7;
  background-color: #ffffff;
  margin: 16px 16px 0 16px;
  width: ${(props) => props.width};
`

export const SideSheet = forwardRef(function SideSheet(
  { width, title, children, className },
  ref,
) {
  let size
  if (width === 'small') {
    size = 240
  } else if (width === 'medium') {
    size = 320
  } else if (width === 'large') {
    size = 480
  } else if (width === 'xlarge') {
    size = 640
  }

  const props = {
    width: size,
  }
  return (
    <StyledSideSheet {...props} className={className} ref={ref}>
      <Typography variant="h2">{title}</Typography>
      {children}
    </StyledSideSheet>
  )
})

SideSheet.displayName = 'eds-sidesheet'

SideSheet.propTypes = {
  // Title for Side Sheet
  title: PropTypes.string,
  // Width of Side Sheet
  width: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // Content, any type of content
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

SideSheet.defaultProps = {
  width: 'medium',
  title: '',
  className: '',
  children: undefined,
}
