import { ForwardRefExoticComponent, forwardRef } from 'react'
import { Button, ButtonProps, Icon, Tooltip } from '@equinor/eds-core-react'
import { sidebar as tokens } from '../SideBar.tokens'
import { useSideBar } from '../SideBar.context'
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
const MenuButtonContainer = styled.div<ContainerProps>(({ open, theme }) => {
  const {
    entities: {
      actionButton: {
        spacings: { right, left, top, bottom },
      },
    },
  } = theme
  return css`
    display: ${open ? 'grid' : 'flex'};
    grid-template-columns: ${left} 1fr ${right};
    justify-content: center;
    align-items: center;
    margin-block-start: ${top};
    margin-block-end: ${bottom};
    box-sizing: border-box;
  `
})

const ExtendedButton = styled(Button)(() => {
  return css`
    height: 40px;
    grid-column: 2;
    width: fit-content;
  `
})

export type SideBarButtonProps = {
  label: string
  icon: IconData
} & Omit<ButtonProps, 'href' | 'type' | 'fullWidth' | 'variant'>

export const SideBarButton: ForwardRefExoticComponent<SideBarButtonProps> =
  forwardRef<HTMLButtonElement, SideBarButtonProps>(function SideBarToggle(
    { label, icon, style, className, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
    }
    const styleProps = {
      style,
      className,
    }
    const { isOpen } = useSideBar()
    if (isOpen) {
      return (
        <MenuButtonContainer open={isOpen} {...styleProps}>
          <ExtendedButton open variant="contained" {...props}>
            <Icon data={icon} color={primaryWhite} /> {label}
          </ExtendedButton>
        </MenuButtonContainer>
      )
    }
    return (
      <Tooltip title={label} placement="right">
        <MenuButtonContainer open={isOpen} {...styleProps}>
          <Button variant="contained_icon" {...props}>
            <Icon data={icon} color={primaryWhite} />
          </Button>
        </MenuButtonContainer>
      </Tooltip>
    )
  })
