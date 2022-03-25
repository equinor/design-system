import React, { forwardRef } from 'react'
import { sidebar as tokens } from '../SideBar.tokens'
import { bordersTemplate } from '@equinor/eds-utils'
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip as EDSTooltip,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { IconData } from '@equinor/eds-icons'
import { useSideBar } from '../SideBar'

const {
  entities: {
    menuItem: {
      border,
      spacings: { bottom: mediumSpacing },
      typography: { color: itemTextColor },
      states: {
        active: {
          background: menuActiveBackground,
          typography: { color: iconActive },
        },
        hover: { background: menuHoverBackground },
        disabled: {
          background: menuDisabledBackground,
          typography: { color: menuDisabledText },
        },
      },
    },
  },
} = tokens

type ContainerProps = {
  active?: boolean
  open?: boolean
} & StrippedButton

type StrippedButton = Omit<
  ButtonProps,
  keyof React.ButtonHTMLAttributes<HTMLButtonElement>
>

const Container = styled(Button)<ContainerProps>`
  background: ${(props) => (props.active ? menuActiveBackground : 'none')};
  display: ${(props) => (props.open ? 'grid' : 'flex')};
  grid-template-columns: repeat(10, 1fr);
  grid-gap: ${mediumSpacing};
  justify-content: ${(props) => !props.open && 'center'};
  align-items: center;
  ${bordersTemplate(border)}
  text-decoration: none;
  min-height: 72px;

  &:hover {
    cursor: pointer;
    background: ${menuHoverBackground};
  }

  &:disabled {
    background: ${menuDisabledBackground};
    color: ${menuDisabledText};
  }
`

const ItemIcon = styled(Icon)`
  grid-column: 2;
  margin-left: -4px;
`

type ItemTextProps = {
  active?: boolean
}

const ItemText = styled(Typography)<ItemTextProps>`
  font-weight: ${(props) => (props.active ? '500' : '400')};
  grid-column: 3 / -1;
  color: ${itemTextColor};
  &::first-letter {
    text-transform: capitalize;
  }
`

const Tooltip = styled(EDSTooltip)`
  text-transform: capitalize;
`

export type MenuItemType = {
  icon?: IconData
  name: string
  link?: string
  onClick?: () => void
}

export type MenuItemProps = {
  currentUrl?: string
} & MenuItemType &
  React.HTMLAttributes<HTMLAnchorElement>

export const MenuItem = forwardRef<HTMLAnchorElement, MenuItemProps>(
  ({ currentUrl, icon, name, link, onClick, ...rest }, ref) => {
    const isCurrentUrl = () => currentUrl?.includes(link)
    const { isOpen } = useSideBar()

    const getIconColor = () => {
      return isCurrentUrl() ? iconActive : itemTextColor
    }

    if (isOpen) {
      return (
        <Container
          as="a"
          active={isCurrentUrl()}
          onClick={onClick}
          variant="ghost"
          open
          ref={ref}
          {...rest}
        >
          {icon && <ItemIcon data={icon} color={getIconColor()} />}
          <ItemText variant="cell_text" group="table" active={isCurrentUrl()}>
            {name}
          </ItemText>
        </Container>
      )
    }

    return (
      <Tooltip title={name} placement="right">
        <Container
          as="a"
          active={isCurrentUrl()}
          onClick={onClick}
          variant="ghost"
          open={isOpen}
          ref={ref}
          {...rest}
        >
          {icon && <ItemIcon data={icon} color={getIconColor()} />}
        </Container>
      </Tooltip>
    )
  },
)

MenuItem.displayName = 'MenuItem'
