import { forwardRef, ForwardRefExoticComponent, HTMLAttributes } from 'react'
import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
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
        spacings: { top, bottom },
      },
    },
  } = theme
  return css`
    width: ${minWidth};
    display: grid;
    place-items: center;
    margin-block-start: ${top};
    margin-block-end: ${bottom};
  `
})

type SideBarToggleProps = HTMLAttributes<HTMLDivElement>

export const SideBarToggle: ForwardRefExoticComponent<SideBarToggleProps> =
  forwardRef<HTMLDivElement, SideBarToggleProps>(function SideBarToggle(
    { ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
    }
    const { isOpen, setIsOpen } = useSideBar()
    return (
      <ToggleContainer open={isOpen} {...props}>
        <Tooltip title={isOpen ? 'Collapse' : 'Expand'} placement="right">
          <Button variant="ghost_icon" onClick={() => setIsOpen(!isOpen)}>
            <Icon
              size={24}
              data={isOpen ? collapse : expand}
              color={iconColor}
            />
          </Button>
        </Tooltip>
      </ToggleContainer>
    )
  })
