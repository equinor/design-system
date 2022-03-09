import React from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  Typography,
  Tooltip as EDSTooltip,
} from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'

const { colors, shape, spacings } = tokens

interface ContainerProps {
  open: boolean
}
const MenuButtonContainer = styled.div<ContainerProps>`
  display: ${(props) => (props.open ? 'grid' : 'flex')};
  grid-template-columns: repeat(9, 1fr);
  justify-content: center;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid ${colors.ui.background__medium.hex};
  box-sizing: border-box;
`
interface CustomButtonProps extends ButtonProps {
  open?: boolean
}

const CreateNewButton = styled(Button)<CustomButtonProps>`
  width: ${(props) => (props.open ? 'fit-content' : '40px')};
  height: ${(props) => (props.open ? '36px' : '40px')};
  background: ${colors.interactive.primary__resting.hsla};
  border-radius: ${(props) => props.open && shape.icon_button.borderRadius};
  grid-column: 3;
  ${(props) =>
    props.open &&
    `
  padding-right: ${spacings.comfortable.large};
  margin-left: -2px; /* border size */
  `};

  &:hover {
    border-radius: ${(props) => props.open && shape.icon_button.borderRadius};
    background: ${colors.interactive.primary__hover.hex};
  }
`

const CreateNewButtonText = styled(Typography)`
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

interface CreateItemProps {
  createLabel: string
  onCreate: () => void
  isOpen: boolean
}

export const CreateItem: React.FC<CreateItemProps> = ({
  createLabel,
  onCreate,
  isOpen,
}) => {
  if (isOpen) {
    return (
      <MenuButtonContainer open={isOpen}>
        <CreateNewButton open variant="contained" onClick={onCreate}>
          <Icon data={add} color={colors.ui.background__default.hsla} />
          <CreateNewButtonText
            color={colors.text.static_icons__primary_white.hsla}
            variant="button"
            group="navigation"
          >
            {createLabel}
          </CreateNewButtonText>
        </CreateNewButton>
      </MenuButtonContainer>
    )
  }
  return (
    <Tooltip title={createLabel} placement="right">
      <MenuButtonContainer open={isOpen}>
        <CreateNewButton variant="ghost_icon" onClick={onCreate}>
          <Icon data={add} color={colors.ui.background__default.hsla} />
        </CreateNewButton>
      </MenuButtonContainer>
    </Tooltip>
  )
}
