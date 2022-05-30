import { HTMLAttributes, forwardRef, useEffect } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { sidebar as tokens } from './SideBar.tokens'
import { bordersTemplate, useToken } from '@equinor/eds-utils'
//import { ToggleOpen } from './ToggleOpen'
//import { ActionButton } from './ActionButton'
import { useEds } from '@equinor/eds-core-react'
import { IconData } from '@equinor/eds-icons'
import { useSideBar, SideBarProvider } from './SideBar.context'

type ContainerProps = {
  open: boolean
  maxHeight?: string
}

const SideBarContainer = forwardRef<HTMLDivElement, SidebarProps>(
  function SideBarContainer(
    {
      onAction,
      actionLabel,
      actionIcon,
      toggleButton,
      onToggle,
      open = false,
      maxHeight,
      children,
      ...rest
    },
    ref,
  ) {
    const { isOpen, setIsOpen } = useSideBar()
    const handleToggle = (toggle: boolean) => {
      setIsOpen(toggle)
      //onToggle?.(toggle)
    }

    useEffect(() => {
      handleToggle(open)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
      <GridContainer open={isOpen} ref={ref} maxHeight={maxHeight}>
        {children}
      </GridContainer>
    )
  },
)

const GridContainer = styled.div<ContainerProps>(
  ({ theme, open, maxHeight }) => {
    return css`
      ${bordersTemplate(theme.border)}
      display: grid;
      grid-template-rows: 1fr auto;
      height: 100%;
      grid-template-areas:
        'content'
        'footer';
      background-color: ${theme.background};
      //padding-bottom: ${theme.spacings.bottom};
      overflow: hidden;
      width: ${open ? '256px' : '72px'};
      min-width: ${open ? '256px' : '72px'};
      ${maxHeight && css({ maxHeight: maxHeight })}
    `
  },
)

type SidebarProps = {
  onAction?: () => void
  actionLabel?: string
  actionIcon?: IconData
  toggleButton?: 'top' | 'bottom'
  open?: boolean
  maxHeight?: string
  onToggle?: (state: boolean) => void
} & HTMLAttributes<HTMLDivElement>

export const SideBar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      onAction,
      actionLabel,
      actionIcon,
      toggleButton,
      onToggle,
      open = false,
      maxHeight,
      children,
      ...rest
    },
    ref,
  ) => {
    const { density } = useEds()
    const token = useToken({ density }, tokens)

    const props = {
      onAction,
      actionLabel,
      actionIcon,
      toggleButton,
      onToggle,
      open,
      maxHeight,
      children,
      ...rest,
    }

    return (
      <ThemeProvider theme={token}>
        <SideBarProvider>
          <SideBarContainer {...props} ref={ref} />
        </SideBarProvider>
      </ThemeProvider>
    )
  },
)

SideBar.displayName = 'SideBar'
