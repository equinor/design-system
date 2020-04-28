import React, { forwardRef, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import createId from 'lodash.uniqueid'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

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
  const [drawerOpen, setDrawerOpen] = useState(open)

  const handleOnClick = (event, index) => {
    console.log('click', event.target, index)
    setDrawerOpen(!drawerOpen)

    event.stopPropagation()
  }

  const drawerListId = useMemo(() => createId('drawerlist-'), [])

  const ListItems = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      drawerListId,
      index,
      level,
      onClick: (event) => handleOnClick(event, index),
    })
  })

  console.log('list: ', drawerOpen, drawerListId, level, ListItems)

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
