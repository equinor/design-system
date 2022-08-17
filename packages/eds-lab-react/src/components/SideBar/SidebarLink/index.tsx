import { HTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react'
import { sidebar as tokens } from '../SideBar.tokens'
import { bordersTemplate, outlineTemplate } from '@equinor/eds-utils'
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip as EDSTooltip,
  Typography,
} from '@equinor/eds-core-react'
import styled, { css } from 'styled-components'
import { IconData } from '@equinor/eds-icons'
import { useSideBar } from '../SideBar.context'

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
} & StrippedButton

type StrippedButton = Omit<
  ButtonProps,
  keyof ButtonHTMLAttributes<HTMLButtonElement>
>

const Container = styled(Button)<ContainerProps>(({ theme, active }) => {
  const {
    minWidth,
    entities: {
      sidebarItem: {
        minHeight,
        border,
        states: {
          active: { background: menuActiveBackground },
          hover: { background: menuHoverBackground },
          focus,
          disabled: {
            background: menuDisabledBackground,
            typography: { color: menuDisabledText },
          },
        },
      },
    },
  } = theme
  return css`
    background-color: ${active ? menuActiveBackground : 'none'};
    display: grid;
    grid-template-columns: ${minWidth} 1fr;
    place-items: center;
    ${bordersTemplate(border)}
    text-decoration: none;
    min-height: ${minHeight};
    &:hover {
      cursor: pointer;
      background-color: ${active ? menuActiveBackground : menuHoverBackground};
    }
    &:disabled {
      background-color: ${menuDisabledBackground};
      color: ${menuDisabledText};
    }
    &:focus-visible {
      ${outlineTemplate(focus.outline)};
    }
  `
})

type ItemTextProps = {
  active?: boolean
}

const ItemText = styled(Typography)<ItemTextProps>(({ theme, active }) => {
  const {
    entities: {
      sidebarItem: {
        typography: { color: itemTextColor },
        states: {
          active: {
            typography: { color: itemActiveTextColor },
          },
        },
      },
    },
  } = theme
  return css`
    justify-self: start;
    color: ${active ? itemActiveTextColor : itemTextColor};
    &::first-letter {
      text-transform: capitalize;
    }
  `
})

const Tooltip = styled(EDSTooltip)`
  text-transform: capitalize;
`
type OverridableComponent<Component, Element extends HTMLElement> = {
  (props: Component & React.RefAttributes<Element>): ReturnType<React.FC>

  <As extends React.ElementType>(
    props: {
      as: As
    } & Component &
      Omit<React.ComponentPropsWithRef<As>, keyof Component>,
  ): ReturnType<React.FC>
}

export type SidebarLinkType = {
  icon?: IconData
  name: string
  link?: string
  onClick?: () => void
}

export type SidebarLinkProps = {
  currentUrl?: string
} & SidebarLinkType &
  HTMLAttributes<HTMLAnchorElement>

export const SidebarLink: OverridableComponent<
  SidebarLinkProps,
  HTMLAnchorElement
> = forwardRef(
  ({ currentUrl, icon, name, link, onClick, as = 'a', ...rest }, ref) => {
    const isCurrentUrl = () => currentUrl?.includes(link)
    const { isOpen } = useSideBar()

    const getIconColor = () => {
      return isCurrentUrl() ? iconActive : itemTextColor
    }

    if (isOpen) {
      return (
        <Container
          as={as}
          tabIndex={0}
          active={isCurrentUrl()}
          onClick={onClick}
          variant="ghost"
          ref={ref}
          {...rest}
        >
          {icon && <Icon data={icon} color={getIconColor()} />}
          <ItemText variant="cell_text" group="table" active={isCurrentUrl()}>
            {name}
          </ItemText>
        </Container>
      )
    }

    return (
      <Tooltip title={name} placement="right">
        <Container
          tabIndex={0}
          as={as}
          active={isCurrentUrl()}
          onClick={onClick}
          variant="ghost"
          ref={ref}
          {...rest}
        >
          {icon && <Icon data={icon} color={getIconColor()} />}
        </Container>
      </Tooltip>
    )
  },
)

SidebarLink.displayName = 'SidebarItem'
