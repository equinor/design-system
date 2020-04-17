import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

const StyledDrawerList = styled.ul`
  margin: 0;
  padding: 0;
  background: ${background};
  width: 256px;
  border-right: none;

  ${({ open }) =>
    !open &&
    css`
      > li ul {
        display: none;
      }
    `}

  ${({ level }) =>
    level === 'grandparent' &&
    css`
      > li {
        border-left: none;
      }
      > li > a {
        border-left: none;
      }
    `}

  ${({ level }) =>
    level === 'parent' &&
    css`
      > li {
        border-left: none;
      }
      > li > a {
        border-left: none;
      }
    `}
`

export const DrawerList = forwardRef(function EdsDrawerList(
  { children, level, open, ...props },
  ref,
) {
  return (
    <StyledDrawerList {...props} level={level} open={open} ref={ref}>
      {children}
    </StyledDrawerList>
  )
})

DrawerList.displayName = 'eds-drawer-list'

DrawerList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Ancestor level */
  level: PropTypes.oneOf(['child', 'parent', 'grandparent']),
  open: PropTypes.bool,
}

DrawerList.defaultProps = {
  className: '',
  children: undefined,
  level: 'child',
  open: false,
}
