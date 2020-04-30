import React, { forwardRef, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import createId from 'lodash.uniqueid'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background } = tokens

const StyledDrawerList = styled.ul.attrs((drawerOpen) => ({
  drawerOpen,
}))`
  margin: 0;
  padding: 0;
  background: ${background};
  width: 256px;
  border-right: none;

  li {
    padding-left: 16px;
  }

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

  ${({ level }) =>
    level === 'child' &&
    css`
      > li {
        margin-left: 16px;
        padding-left: 0;
      }
    `}
`

export const DrawerList = forwardRef(function EdsDrawerList(
  { children, level, open, ...props },
  ref,
) {
  const drawerListId = useMemo(() => createId('drawerlist-'), [])

  let ListItems

  if (Array.isArray(children)) {
    ListItems = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        drawerListId,
        index,
        level,
        open,
      })
    })
  } else {
    ListItems = []
    ListItems.push(
      React.cloneElement(children, {
        drawerListId,
        level,
        open,
      }),
    )
  }

  return (
    <StyledDrawerList {...props} level={level} open={open} ref={ref}>
      {ListItems}
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
  /** Open or collapsed */
  open: PropTypes.bool,
}

DrawerList.defaultProps = {
  className: '',
  children: undefined,
  level: 'child',
  open: false,
}
