import React, { forwardRef, HTMLAttributes, useMemo } from 'react'
import createId from 'lodash/uniqueid'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background } = tokens

const StyledDrawerList = styled.ul.attrs((drawerOpen) => ({
  drawerOpen,
}))<DrawerListProps>`
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

type DrawerListProps = {
  /** Ancestor level */
  level?: 'child' | 'parent' | 'grandparent'
  /** Open or collapsed */
  open?: boolean
} & HTMLAttributes<HTMLUListElement>

type DrawerListChildrenType = {
  drawerListId?: number
} & React.ReactElement

export const DrawerList = forwardRef<HTMLUListElement, DrawerListProps>(
  function DrawerList({ children, level = 'child', open, ...props }, ref) {
    const drawerListId = useMemo(() => createId('drawerlist-'), [])

    let ListItems: Array<DrawerListChildrenType>

    if (Array.isArray(children)) {
      ListItems = React.Children.map(
        children,
        (child: DrawerListChildrenType, index) => {
          return React.cloneElement(child, {
            drawerListId,
            index,
            level,
            open,
          })
        },
      )
    } else {
      ListItems = []
      ListItems.push(
        React.cloneElement(children as DrawerListChildrenType, {
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
  },
)
