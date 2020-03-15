import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import { spacingsTemplate } from '../_common/templates'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { sidesheet as tokens } from './SideSheet.tokens'

const icons = {
  clear,
}

Icon.add(icons)

const { background, spacings, border } = tokens

const StyledSideSheet = styled.div`
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  z-index: inherit top;
  box-sizing: border-box;
  border-bottom: ${border.left.width} solid ${border.left.color};
  background: ${background};
  width: ${(props) => props.width};

  ${spacingsTemplate(spacings)};
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
  { size, title, children, className, open, onClose },
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

  // Controller must set open={false} when pressing the close button
  return open ? (
    <StyledSideSheet {...props} className={className} ref={ref}>
      <Wrapper>
        <Typography variant="h2">{title}</Typography>
        <Button variant="ghost_icon" onClick={onClose} title="Close">
          <Icon name="clear" title="Close" />
        </Button>
      </Wrapper>
      {children}
    </StyledSideSheet>
  ) : null
})

// SideSheet.displayName = 'eds-sidesheet'

SideSheet.propTypes = {
  // Title for Side Sheet
  title: PropTypes.string,
  // Width of Side Sheet
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // OnClick function (close)
  onClose: PropTypes.func,
  // Open / close
  open: PropTypes.bool,
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
  open: true,
  onClose: undefined,
  children: undefined,
}
