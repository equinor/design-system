import { HTMLAttributes, forwardRef, useEffect } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { sidebar as tokens } from './SideBar.tokens'
import { bordersTemplate, useToken } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'
import { useSideBar, SideBarProvider } from './SideBar.context'

type ContainerProps = {
  open: boolean
}

const SideBarContainer = forwardRef<HTMLDivElement, SidebarProps>(
  function SideBarContainer(
    { onToggle: onToggleCallback, open = false, children, ...rest },
    ref,
  ) {
    const { isOpen, setIsOpen, onToggle, setOnToggle } = useSideBar()

    useEffect(() => {
      if (onToggle === null && onToggleCallback) {
        setOnToggle(onToggleCallback)
      }
    }, [onToggle, onToggleCallback, setOnToggle])

    useEffect(() => {
      setIsOpen(open)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
      <GridContainer {...rest} open={isOpen} ref={ref}>
        {children}
      </GridContainer>
    )
  },
)

const GridContainer = styled.div<ContainerProps>(({ theme, open }) => {
  return css`
    box-sizing: content-box;
    ${bordersTemplate(theme.border)}
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
    grid-template-areas:
      'content'
      'footer';
    background-color: ${theme.background};
    overflow: hidden;
    width: ${open ? theme.maxWidth : theme.minWidth};
    min-width: ${open ? theme.maxWidth : theme.minWidth};
  `
})

type SidebarProps = {
  open?: boolean
  onToggle?: (state: boolean) => void
} & HTMLAttributes<HTMLDivElement>

export const SideBar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ onToggle, open = false, children, ...rest }, ref) => {
    const { density } = useEds()
    const token = useToken({ density }, tokens)

    const props = {
      onToggle,
      open,
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
