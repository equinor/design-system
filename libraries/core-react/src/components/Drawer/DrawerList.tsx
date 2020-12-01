import React, { forwardRef, HTMLAttributes, useMemo } from 'react'
import createId from 'lodash/uniqueId'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'
import { useTreeState, TreeState } from '@react-stately/tree'
import {
  useMenu,
  useMenuItem,
  useMenuSection,
  AriaMenuOptions,
} from '@react-aria/menu'
import { useDrawer } from './Drawer.context'

const { background, subtitleBorder, subtitleTypography } = tokens

type DrawerSubtitleProps = {
  /** Subtitle name */
  name?: string
} & HTMLAttributes<HTMLDivElement>

const StyledDrawerSubtitle = styled.div<DrawerSubtitleProps>`
  background: ${background};
  width: 100%;
  padding-top: 7px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: ${subtitleBorder.top.width} solid ${subtitleBorder.top.color};
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

const StyledDrawerList = styled.ul.attrs((drawerOpen) => ({
  drawerOpen,
}))<DrawerListProps>`
  margin: 0;
  padding: 0;
  background: ${background};
  width: 256px;
  border-right: none;

  li {
    //padding-left: 16px;
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
        /* margin-left: 16px; */
        padding-left: 0;
      }
    `}
`

type DrawerListProps = {
  /** Ancestor level */
  level?: 'child' | 'parent' | 'grandparent'
  /** Open or collapsed */
  open?: boolean
  /** Subtitle (only available for grandparent) */
  subtitle?: string
} & HTMLAttributes<HTMLUListElement>

type DrawerListChildrenType = {
  drawerListId?: number | TreeState<unknown>
  children?: React.ReactElement | AriaMenuOptions<unknown>
} & React.ReactElement

export const DrawerList = forwardRef<HTMLUListElement, DrawerListProps>(
  function DrawerList(
    { children, level = 'child', subtitle, open, ...props },
    ref,
  ) {
    const drawerListId = useMemo(() => createId('drawerlist-'), [])
    const { focusedIndex, setFocusedIndex } = useDrawer()

    // const useref = React.useRef<HTMLUListElement>(null)
    // const { menuProps } = useMenu(
    //   children as AriaMenuOptions<unknown>,
    //   (focusedIndex as unknown) as TreeState<unknown>, // https://github.com/microsoft/TypeScript/issues/28067
    //   useref,
    // )
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
      <>
        {level === 'grandparent' && subtitle !== '' && (
          <StyledDrawerSubtitle name={subtitle}>
            {subtitle}
          </StyledDrawerSubtitle>
        )}
        <StyledDrawerList
          // {...menuProps}
          {...props}
          level={level}
          open={open}
          ref={ref}
        >
          {ListItems}
        </StyledDrawerList>
      </>
    )
  },
)
