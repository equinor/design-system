import { FC } from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  Typography,
  Tooltip as EDSTooltip,
} from '@equinor/eds-core-react'
import { sidebar as tokens } from '../SideBar.tokens'
import { bordersTemplate } from '@equinor/eds-utils'
import styled, { css } from 'styled-components'
import { add } from '@equinor/eds-icons'

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
  const {
    entities: {
      actionButton: { border },
    },
  } = theme
  return css`
    display: ${open ? 'grid' : 'flex'};
    ${bordersTemplate(border)}
    grid-template-columns: repeat(9, 1fr);
    justify-content: center;
    align-items: center;
    height: 100%;
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

export type ActionButtonProps = {
  actionLabel: string
  onAction: () => void
  isOpen: boolean
}

export const ActionButton: FC<ActionButtonProps> = ({
  actionLabel,
  onAction,
  isOpen,
}) => {
  if (isOpen) {
    return (
      <MenuButtonContainer open={isOpen}>
        <ExtendedButton open variant="contained" onClick={onAction}>
          <Icon data={add} color={primaryWhite} />
          <ExtendedButtonText
            color={primaryWhite}
            variant="button"
            group="navigation"
          >
            {actionLabel}
          </ExtendedButtonText>
        </ExtendedButton>
      </MenuButtonContainer>
    )
  }
  return (
    <Tooltip title={actionLabel} placement="right">
      <MenuButtonContainer open={isOpen}>
        <ExtendedButton variant="ghost_icon" onClick={onAction}>
          <Icon data={add} color={primaryWhite} />
        </ExtendedButton>
      </MenuButtonContainer>
    </Tooltip>
  )
}
