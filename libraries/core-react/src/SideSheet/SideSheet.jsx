import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import { Typography } from '../Typography'
import { Icon } from '../Icon'

const icons = {
  clear,
}

Icon.add(icons)

const StyledSideSheet = styled.div`
  border-left: 2px solid #f7f7f7;
  background-color: #ffffff;
  margin: 16px 16px 0 16px;
  width: ${(props) => props.width};
`

export const SideSheet = forwardRef(function SideSheet(
  { size, title, children, className },
  ref,
) {
  let width
  if (size === 'small') {
    width = 240
  } else if (size === 'medium') {
    width = 320
  } else if (size === 'large') {
    width = 480
  } else if (size === 'xlarge') {
    width = 640
  }

  const props = {
    width,
  }
  return (
    <StyledSideSheet {...props} className={className} ref={ref}>
      <Typography variant="h2">{title}</Typography>
      {children}
      <Icon name="clear" color="#007079" />
    </StyledSideSheet>
  )
})

// SideSheet.displayName = 'eds-sidesheet'

SideSheet.propTypes = {
  // Title for Side Sheet
  title: PropTypes.string,
  // Width of Side Sheet
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // Content, any type of content
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

SideSheet.defaultProps = {
  size: 'medium',
  title: '',
  className: '',
  children: undefined,
}
