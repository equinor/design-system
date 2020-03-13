import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'

const icons = {
  clear,
}

Icon.add(icons)

const StyledSideSheet = styled.div`
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: inherit top;
  box-sizing: border-box;
  border-left: 2px solid #f7f7f7;
  background-color: #ffffff;
  padding: 16px 16px 0 16px;
  width: ${(props) => props.width};
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  padding-right: 10px;
`

export const SideSheet = forwardRef(function SideSheet(
  { size, title, children, className, onClick },
  ref,
) {
  let width
  if (size === 'small') {
    width = '240px'
  } else if (size === 'medium') {
    width = '320px'
  } else if (size === 'large') {
    width = '480px'
  } else if (size === 'xlarge') {
    width = '640px'
  }

  const props = {
    width,
  }
  return (
    <StyledSideSheet {...props} className={className} ref={ref}>
      <Wrapper>
        <Typography variant="h2">{title}</Typography>
        <Button variant="ghost_icon" onClick={onClick}>
          <Icon name="clear" title="close" />
        </Button>
      </Wrapper>
      {children}
    </StyledSideSheet>
  )
})

// SideSheet.displayName = 'eds-sidesheet'

SideSheet.propTypes = {
  // Title for Side Sheet
  title: PropTypes.string,
  // Width of Side Sheet
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // OnClick function (close)
  onClick: PropTypes.func,
  // Any type of content
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

SideSheet.defaultProps = {
  size: 'medium',
  title: '',
  className: '',
  onClick: undefined,
  children: undefined,
}
