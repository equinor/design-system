import { HTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react'
import { sidebar as tokens } from '../SideBar.tokens'
import { bordersTemplate } from '@equinor/eds-utils'
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip as EDSTooltip,
  Typography,
} from '@equinor/eds-core-react'
import styled, { css } from 'styled-components'
import { IconData } from '@equinor/eds-icons'
import { useSideBar } from '../SideBar'

const {
  entities: {
    sidebarItem: {
      typography: { color: itemTextColor },
      states: {
        active: {
          typography: { color: iconActive },
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
  keyof ButtonHTMLAttributes<HTMLButtonElement>
>

const Container = styled(Button)<ContainerProps>(({ theme, open, active }) => {
  const {
    entities: {
      sidebarItem: {
        border,
        spacings: { bottom: mediumSpacing },
        states: {
          active: { background: menuActiveBackground },
          hover: { background: menuHoverBackground },
          disabled: {
            background: menuDisabledBackground,
            typography: { color: menuDisabledText },
          },
        },
      },
    },
  } = theme
  return css`
    background: ${active ? menuActiveBackground : 'none'};
    display: ${open ? 'grid' : 'flex'};
    grid-template-columns: repeat(10, 1fr);
    grid-gap: ${mediumSpacing};
    justify-content: ${!open && 'center'};
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
})

const ItemIcon = styled(Icon)`
  grid-column: 2;
  margin-left: -4px;
`

type ItemTextProps = {
  active?: boolean
}

const ItemText = styled(Typography)<ItemTextProps>(({ theme, active }) => {
  const {
    entities: {
      sidebarItem: {
        typography: { color: itemTextColor },
      },
    },
  } = theme
  return css`
    font-weight: ${active ? '500' : '400'};
    grid-column: 3 / -1;
    color: ${itemTextColor};
    &::first-letter {
      text-transform: capitalize;
    }
  `
})

const Tooltip = styled(EDSTooltip)`
  text-transform: capitalize;
`

export type SidebarItemType = {
  icon?: IconData
  name: string
  link?: string
  onClick?: () => void
}

export type SidebarItemProps = {
  currentUrl?: string
} & SidebarItemType &
  HTMLAttributes<HTMLAnchorElement>

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
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

SidebarItem.displayName = 'SidebarItem'
