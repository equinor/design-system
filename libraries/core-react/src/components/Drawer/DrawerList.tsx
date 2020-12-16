import React, {
  forwardRef,
  HTMLAttributes,
  useMemo,
  ReactElement,
  useRef,
  useState,
  MouseEvent,
  useEffect,
  AnchorHTMLAttributes,
} from 'react'
import createId from 'lodash/uniqueId'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'
import { Divider } from '../Divider'
import { Typography } from '../Typography'
import { Icon } from '../Icon'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { useFocus } from '@react-aria/interactions'
import { useTreeState, TreeState, TreeProps } from '@react-stately/tree'
import { mergeProps } from '@react-aria/utils'
import {
  useMenu,
  useMenuItem,
  useMenuSection,
  AriaMenuOptions,
} from '@react-aria/menu'
import { List } from '../List'
import { useDrawer } from './Drawer.context'

const { background, subtitleBorder, subtitleTypography } = tokens

const icons = {
  chevron_down,
  chevron_up,
}

Icon.add(icons)

import { DrawerLabel } from './DrawerLabel'

type DrawerSubtitleProps = {
  /** Subtitle name */
  name?: string
} & HTMLAttributes<HTMLSpanElement>

const StyledDrawerSubtitle = styled.span<DrawerSubtitleProps>`
  background: ${background};
  width: 100%;
  padding-top: 7px;
  padding-left: 16px;
  padding-right: 16px;
  /* border-top: ${subtitleBorder.top.width} solid ${subtitleBorder.top
    .color}; */
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

const Label = styled(Typography)`
  width: calc(100% - 48px - 14px); // Todo: add dynamic tokens
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

const StyledDrawerList = styled(List).attrs<DrawerListProps>(
  ({ open }): JSX.IntrinsicElements['ul'] => ({
    'aria-hidden': !open,
    'aria-expanded': open,
  }),
)<DrawerListProps>`
  margin: 0;
  padding: 0;
  background: ${background};
  width: 256px;
  border-right: none;

  > li {
    //padding-left: 16px;

    border-left: none;
  }

  > li > a {
    width: calc(100% - 48px - 14px); // Todo: add dynamic tokens
    /* display: inline-flex; */
    /* border-left: none; */
  }

  /* svg {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }
  svg.chevron_icon {
    /* position: absolute;
    right: 16px;
    top: 16px; 
    width: 16px;
    height: 16px;
  } */

  ${({ isExpandable }) =>
    isExpandable
      ? css`
          > li {
            /* margin-left: 16px; */
            padding-left: 0;
            border-left: none;
          }
        `
      : css`
          > li {
            /* border-left: none; */
          }
        `}/* ${({ level }) =>
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
    `} */
`

type DrawerListProps = {
  /** Ancestor level */
  level?: 'child' | 'parent' | 'grandparent'
  /** Open or collapsed */
  open?: boolean
  /** Subtitle (only available for grandparent) */
  subtitle?: string
  /** Label */
  label?: string
  /** Is the list expandable / nested */
  isExpandable?: boolean
  /** Is the list disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLUListElement>

type DrawerListChildrenType = {
  drawerListId?: number
  children?: React.ReactElement
  index?: number
} & Pick<DrawerListProps, 'level' | 'open'> &
  React.ReactElement

export const DrawerList = forwardRef<HTMLUListElement, DrawerListProps>(
  function DrawerList(
    {
      children,
      level = 'child',
      subtitle,
      open = true,
      isExpandable,
      label = '',
      disabled,
      ...props
    },
    ref,
  ) {
    const drawerListId = useMemo<string>(
      () => createId(level + '-drawerlist-'),
      [],
    )
    const { focusedIndex, setFocusedIndex } = useDrawer()
    const [isExpanded, setIsExpanded] = useState(open)

    const ListItems = React.Children.map(children, (child, index) => {
      if (!child) return null
      return React.cloneElement(child as ReactElement, {
        drawerListId,
        index,
        level,
        open,
      })
    })

    // let state = useTreeState({ collection: ListItems, selectionMode: 'none' })

    // const useref = React.useRef<HTMLUListElement>(null)
    // const { menuProps } = useMenu(
    //   children as AriaMenuOptions<unknown>,
    //   (focusedIndex as unknown) as TreeState<unknown>, // https://github.com/microsoft/TypeScript/issues/28067
    //   useref,
    // )
    //  let ListItems: Array<DrawerListChildrenType>

    // ListItems.map((item, index) => {
    //   console.log(
    //     focusedIndex,
    //     item.props.index,
    //     item.props.drawerListId,
    //     item.props.children,
    //     item.props.level,
    //     item.props.open,
    //   )
    // })

    // Expand nested list
    const handleClick = (event: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!disabled) {
        setIsExpanded(!isExpanded)
        event.stopPropagation()
      }
    }

    const isGrandparent = level === 'grandparent'

    const chevronIcon = (
      <StyledIcon
        className="chevron_icon"
        key={`${drawerListId}-icon`}
        name={open ? 'chevron_up' : 'chevron_down'}
        size={16}
      />
    )

    return (
      <>
        {level !== 'child' && subtitle && (
          <>
            <Divider style={{ padding: '0px 16px' }} />
            <StyledDrawerSubtitle name={subtitle}>
              {subtitle}
            </StyledDrawerSubtitle>
          </>
        )}

        {/* {isExpandable && label !== '' ? (
          <DrawerLabel>{label}</DrawerLabel>
        ) : isExpandable && label === '' ? (
          <DrawerLabel>Define a label</DrawerLabel>
        ) : null} */}
        {isExpandable && label !== '' && (
          <Label
            // eslint-disable-next-line react/no-array-index-key
            className="submenuLabel"
            aria-haspopup="true"
            key={`${label}-submenu-label`}
            variant="body_short"
            onClick={() => handleClick}
            link
            role="button"
            tabIndex={0}
            // style={{
            //   width: 'calc(100% - 48px - 14px)',
            //   position: 'relative',
            // }}
          >
            {label}
            {chevronIcon}
          </Label>
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

// function MenuItem({ item, state, onAction }) {
//   let ref = useRef<HTMLLIElement>(null)
//   let { menuItemProps } = useMenuItem(
//     {
//       key: item.key,
//       isDisabled: item.isDisabled,
//       onAction,
//     },
//     state,
//     ref,
//   )

//   let [isFocused, setFocused] = useState(false)
//   let { focusProps } = useFocus({ onFocusChange: setFocused })

//   return (
//     <li
//       {...mergeProps(menuItemProps, focusProps)}
//       ref={ref}
//       style={{
//         background: isFocused ? 'gray' : 'transparent',
//         color: isFocused ? 'white' : null,
//         padding: '2px 5px',
//         outline: 'none',
//         cursor: 'pointer',
//       }}
//     >
//       {item.rendered}
//     </li>
//   )
// }
