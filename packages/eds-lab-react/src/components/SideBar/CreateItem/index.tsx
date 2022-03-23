import React from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  Typography,
  Tooltip as EDSTooltip,
} from '@equinor/eds-core-react'
import { sidebar as tokens } from '../SideBar.tokens'
import { bordersTemplate } from '@equinor/eds-utils'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'

const {
  entities: {
    createItem: {
      background: buttonBackground,
      border,
      spacings: { right: largeSpacing },
      typography: { color: primaryWhite },
      states: {
        hover: { background: buttonHover },
      },
    },
  },
} = tokens

type ContainerProps = {
  open: boolean
}
const MenuButtonContainer = styled.div<ContainerProps>`
  display: ${(props) => (props.open ? 'grid' : 'flex')};
  ${bordersTemplate(border)}
  grid-template-columns: repeat(9, 1fr);
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
`
type CustomButtonProps = {
  open?: boolean
} & ButtonProps

const CreateNewButton = styled(Button)<CustomButtonProps>`
  width: ${(props) => (props.open ? 'fit-content' : '40px')};
  height: ${(props) => (props.open ? '36px' : '40px')};
  background: ${buttonBackground};
  border-radius: ${(props) => props.open && '100px'};
  grid-column: 3;
  ${(props) =>
    props.open &&
    `
  padding-right: ${largeSpacing};
  margin-left: -2px; /* border size */
  `};

  &:hover {
    border-radius: ${(props) => props.open && '100px'};
    background: ${buttonHover};
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

type CreateItemProps = {
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
          <Icon data={add} color={primaryWhite} />
          <CreateNewButtonText
            color={primaryWhite}
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
          <Icon data={add} color={primaryWhite} />
        </CreateNewButton>
      </MenuButtonContainer>
    </Tooltip>
  )
}
