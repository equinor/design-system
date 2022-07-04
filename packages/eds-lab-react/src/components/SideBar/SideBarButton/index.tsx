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
const MenuButtonContainer = styled.div<ContainerProps>(({ open }) => {
  return css`
    display: ${open ? 'grid' : 'flex'};
    grid-template-columns: 8px 1fr 8px;
    justify-content: center;
    align-items: center;
    height: 73px;
    box-sizing: border-box;
  `
})

const ExtendedButton = styled(Button)(({ theme }) => {
  const {
    entities: {
      actionButton: {
        spacings: { right: largeSpacing },
      },
    },
  } = theme
  return css`
    grid-column: 2;
    width: fit-content;
    padding-right: ${largeSpacing};
  `
})

export type SideBarButtonProps = {
  label: string
  icon: IconData
} & ButtonProps

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
