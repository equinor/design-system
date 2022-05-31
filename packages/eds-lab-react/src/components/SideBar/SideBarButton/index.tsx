import { ForwardRefExoticComponent, forwardRef } from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  Typography,
  Tooltip as EDSTooltip,
} from '@equinor/eds-core-react'
import { sidebar as tokens } from '../SideBar.tokens'
import { useSideBar } from '../SideBar.context'
import { bordersTemplate } from '@equinor/eds-utils'
import styled, { css } from 'styled-components'
import { IconData } from '@equinor/eds-icons'

const {
  entities: {
    actionButton: {
      typography: { color: primaryWhite },
    },
  },
} = tokens

type ContainerProps = {
  open: boolean
}
const MenuButtonContainer = styled.div<ContainerProps>(({ theme, open }) => {
  return css`
    display: ${open ? 'grid' : 'flex'};
    grid-template-columns: repeat(9, 1fr);
    justify-content: center;
    align-items: center;
    //height: 100%;
    height: 73px;
    box-sizing: border-box;
  `
})

type CustomButtonProps = {
  open?: boolean
} & ButtonProps

const ExtendedButton = styled(Button)<CustomButtonProps>(({ theme, open }) => {
  const {
    entities: {
      actionButton: {
        background: buttonBackground,
        spacings: { right: largeSpacing },
        states: {
          hover: { background: buttonHover },
        },
      },
    },
  } = theme
  return css`
    width: ${open ? 'fit-content' : '40px'};
    height: ${open ? '36px' : '40px'};
    background: ${buttonBackground};
    border-radius: ${open && '100px'};
    grid-column: 3;
    ${open &&
    `
  padding-right: ${largeSpacing};
  margin-left: -2px; /* border size */
  `};

    &:hover {
      border-radius: ${open && '100px'};
      background: ${buttonHover};
    }
  `
})

const ExtendedButtonText = styled(Typography)`
  font-weight: 400;
  text-transform: lowercase;
  white-space: nowrap;
  &::first-letter {
    text-transform: uppercase;
  }
`

const Tooltip = styled(EDSTooltip)`
  &::first-letter {
    text-transform: uppercase;
  }
`

export type SideBarButtonProps = {
  label: string
  icon: IconData
} & ButtonProps

export const SideBarButton: ForwardRefExoticComponent<SideBarButtonProps> =
  forwardRef<HTMLButtonElement, SideBarButtonProps>(function SideBarToggle(
    { label, icon, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
    }
    const { isOpen } = useSideBar()
    if (isOpen) {
      return (
        <MenuButtonContainer open={isOpen}>
          <ExtendedButton open variant="contained" {...props}>
            <Icon data={icon} color={primaryWhite} />
            <ExtendedButtonText
              color={primaryWhite}
              variant="button"
              group="navigation"
            >
              {label}
            </ExtendedButtonText>
          </ExtendedButton>
        </MenuButtonContainer>
      )
    }
    return (
      <Tooltip title={label} placement="right">
        <MenuButtonContainer open={isOpen}>
          <ExtendedButton variant="ghost_icon" {...props}>
            <Icon data={icon} color={primaryWhite} />
          </ExtendedButton>
        </MenuButtonContainer>
      </Tooltip>
    )
  })
