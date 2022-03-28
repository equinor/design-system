import { FC } from 'react'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { sidebar as tokens } from '../SideBar.tokens'
import { first_page, last_page } from '@equinor/eds-icons'
import styled from 'styled-components'

const {
  entities: {
    toggleOpen: {
      spacings: { right: mediumSpacing, top: mediumSmallSpacing },
      typography: { color: iconColor },
      states: {
        hover: { background: expandHover },
      },
    },
  },
} = tokens

type ContainerProps = {
  open?: boolean
}

const ToggleContainer = styled.div<ContainerProps>`
  display: ${(props) => (props.open ? 'grid' : 'flex')};
  grid-template-columns: repeat(10, 1fr);
  grid-gap: ${mediumSpacing};
  justify-content: center;
  margin-top: auto;
  margin-bottom: ${mediumSpacing};
  ${(props) =>
    !props.open &&
    `
    > button {
      margin-left: -4px;
    }
  `}
`

const LargeButton = styled.button`
  grid-column: 2 / 10;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: ${mediumSpacing};
  align-items: center;
  background: none;
  border: none;
  border-radius: 4px;
  padding: ${mediumSmallSpacing};
  margin-left: -${mediumSpacing};
  margin-right: -${mediumSpacing};
  > p {
    grid-column: 2;
    margin-left: -1px; // border size
  }
  &:hover {
    cursor: pointer;
    background: ${expandHover};
  }
`

const Text = styled(Typography)`
  font-weight: 400;
`

type ToggleOpenProps = {
  isOpen: boolean
  toggle: () => void
}

export const ToggleOpen: FC<ToggleOpenProps> = ({ isOpen, toggle }) => {
  if (isOpen) {
    return (
      <ToggleContainer open={isOpen}>
        <LargeButton onClick={toggle}>
          <Icon size={24} data={first_page} color={iconColor} />
          <Text variant="cell_text" group="table">
            Collapse
          </Text>
        </LargeButton>
      </ToggleContainer>
    )
  }
  return (
    <ToggleContainer open={isOpen}>
      <Tooltip title="Expand" placement="right">
        <Button onClick={toggle} color="secondary" variant="ghost_icon">
          <Icon size={24} data={last_page} color={iconColor} />
        </Button>
      </Tooltip>
    </ToggleContainer>
  )
}
