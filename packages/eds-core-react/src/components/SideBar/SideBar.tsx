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
    { onToggle: onToggleCallback, children, ...rest },
    ref,
  ) {
    const { isOpen, onToggle, setOnToggle } = useSideBar()

    useEffect(() => {
      if (onToggle === null && onToggleCallback) {
        setOnToggle(onToggleCallback)
      }
    }, [onToggle, onToggleCallback, setOnToggle])

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
    overflow: auto;
    width: ${open ? theme.maxWidth : theme.minWidth};
    min-width: ${open ? theme.maxWidth : theme.minWidth};
    ${!open &&
    css`
      scrollbar-width: none; //firefox
      //chrome/edge/safari
      &::-webkit-scrollbar {
        display: none;
      }
    `}
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
        <SideBarProvider isOpen={open}>
          <SideBarContainer {...props} ref={ref} />
        </SideBarProvider>
      </ThemeProvider>
    )
  },
)

SideBar.displayName = 'SideBar'
