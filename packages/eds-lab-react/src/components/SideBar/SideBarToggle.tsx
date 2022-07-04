import { forwardRef, ForwardRefExoticComponent } from 'react'
import { Button, ButtonProps, Icon, Tooltip } from '@equinor/eds-core-react'
import { useSideBar } from './SideBar.context'
import { sidebar as tokens } from './SideBar.tokens'
import { expand, collapse } from '@equinor/eds-icons'
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

const ToggleContainer = styled.div<ContainerProps>(({ theme }) => {
  const {
    minWidth,
    entities: {
      toggleOpen: {
        spacings: { right: mediumSpacing },
      },
    },
  } = theme
  return css`
    width: ${minWidth};
    display: grid;
    place-items: center;
    margin-bottom: ${mediumSpacing};
  `
})

export const SideBarToggle: ForwardRefExoticComponent<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function SideBarToggle({ ...rest }, ref) {
  const props = {
    ...rest,
    ref,
  }
  const { isOpen, setIsOpen } = useSideBar()
  return (
    <ToggleContainer open={isOpen}>
      <Tooltip title={isOpen ? 'Collapse' : 'Expand'} placement="right">
        <Button
          {...props}
          variant="ghost_icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon size={24} data={isOpen ? collapse : expand} color={iconColor} />
        </Button>
      </Tooltip>
    </ToggleContainer>
  )
})
