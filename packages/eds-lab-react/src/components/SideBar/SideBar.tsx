import {
  createContext,
  HTMLAttributes,
  forwardRef,
  useContext,
  useState,
  useEffect,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { sidebar as tokens } from './SideBar.tokens'
import { bordersTemplate, useToken } from '@equinor/eds-utils'
import { ToggleOpen } from './ToggleOpen'
import { ActionButton } from './ActionButton'
import { useEds } from '@equinor/eds-core-react'
import { IconData } from '@equinor/eds-icons'

type ContainerProps = {
  open: boolean
  maxHeight?: string
}

type SideBarContextType = {
  isOpen: boolean
}

export function useSideBar(): SideBarContextType {
  const context = useContext(SideBarContext)
  if (context === undefined) {
    throw new Error('Sidebar hook must be used within Provider')
  }
  return context
}

export const SideBarContext = createContext<SideBarContextType | undefined>(
  undefined,
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

type SidebarType = {
  onAction?: () => void
  actionLabel?: string
  actionIcon?: IconData
  toggleButton?: 'top' | 'bottom'
  open?: boolean
  maxHeight?: string
  onToggle?: (state: boolean) => void
} & HTMLAttributes<HTMLDivElement>

export const SideBar = forwardRef<HTMLDivElement, SidebarType>(
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
    },
    ref,
  ) => {
    const { density } = useEds()
    const token = useToken({ density }, tokens)
    const [isOpen, setIsOpen] = useState<boolean>(open)

    const handleToggle = (toggle: boolean) => {
      setIsOpen(toggle)
      onToggle?.(toggle)
    }

    useEffect(() => {
      handleToggle(open)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
      <ThemeProvider theme={token}>
        <SideBarContext.Provider value={{ isOpen }}>
          <GridContainer open={isOpen} ref={ref} maxHeight={maxHeight}>
            {children}
{/*             {toggleButton && toggleButton === 'top' && (
              <ToggleOpen
                isOpen={isOpen}
                onClick={() => handleToggle(!isOpen)}
              />
            )}
            {onAction && actionLabel && actionIcon && (
              <ActionButton
                isOpen={isOpen}
                icon={actionIcon}
                label={actionLabel}
                onAction={onAction}
              />
            )}
            {children}
            {toggleButton && toggleButton === 'bottom' && (
              <ToggleOpen
                isOpen={isOpen}
                onClick={() => handleToggle(!isOpen)}
              />
            )}
            */}
          </GridContainer>
        </SideBarContext.Provider>
      </ThemeProvider>
    )
  },
)

SideBar.displayName = 'SideBar'
