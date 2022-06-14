import { forwardRef, ForwardRefExoticComponent } from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { useSideBar } from './SideBar.context'
import { sidebar as tokens } from './SideBar.tokens'
import { first_page, last_page } from '@equinor/eds-icons'
import styled, { css } from 'styled-components'

const {
  entities: {
    toggleOpen: {
      typography: { color: iconColor },
    },
  },
} = tokens

type ContainerProps = {
  open?: boolean
}

const ToggleContainer = styled.div<ContainerProps>(({ theme, open }) => {
  const {
    entities: {
      toggleOpen: {
        spacings: { right: mediumSpacing },
      },
    },
  } = theme
  return css`
    display: ${open ? 'grid' : 'flex'};
    grid-template-columns: repeat(10, 1fr);
    grid-gap: ${mediumSpacing};
    justify-content: center;
    margin-bottom: ${mediumSpacing};
    ${!open &&
    `
      > button {
        margin-left: -4px;
      }
    `}
  `
})

const LargeButton = styled.button(({ theme }) => {
  const {
    entities: {
      toggleOpen: {
        spacings: { right: mediumSpacing, top: mediumSmallSpacing },
        states: {
          hover: { background: expandHover },
        },
      },
    },
  } = theme
  return css`
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
})

const Text = styled(Typography)`
  font-weight: 400;
`

export const SideBarToggle: ForwardRefExoticComponent<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function SideBarToggle({ ...rest }, ref) {
  const props = {
    ...rest,
    ref,
  }
  const { isOpen, setIsOpen } = useSideBar()
  if (isOpen) {
    return (
      <ToggleContainer open={isOpen}>
        <LargeButton {...props} onClick={() => setIsOpen(!isOpen)}>
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
        <Button
          {...props}
          color="secondary"
          variant="ghost_icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon size={24} data={last_page} color={iconColor} />
        </Button>
      </Tooltip>
    </ToggleContainer>
  )
})
