import React, { forwardRef, useContext, useState } from 'react'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
//import EquinorLogo from '../EquinorLogo'
import { ToggleOpen } from './ToggleOpen'
import { CreateItem } from './CreateItem'

const { colors, spacings } = tokens
interface ContainerProps {
  open: boolean
  maxHeight?: string
}

const Container = styled.div<ContainerProps>`
  border-right: 1px solid ${colors.ui.background__medium.hsla};
  background-color: ${colors.ui.background__default.hsla};
  display: flex;
  flex-direction: column;
  padding-bottom: ${spacings.comfortable.large};
  overflow: hidden;
  width: ${(props) => (props.open ? '256px' : '72px')};
  min-width: ${(props) => (props.open ? '256px' : '72px')};
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight}`};
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${colors.ui.background__medium.hex};
  padding-top: ${spacings.comfortable.large};
`

const TopContainer = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  align-items: center;
`

interface SideBarContextType {
  isOpen: boolean
}

export function useSideBar(): SideBarContextType {
  const context = useContext(SideBarContext)
  if (context === undefined) {
    throw new Error('Sidebar hook must be used within Provider')
  }
  return context
}

export const SideBarContext = React.createContext<
  SideBarContextType | undefined
>(undefined)

type SidebarType = {
  onCreate?: () => void
  createLabel?: string
  open?: boolean
  maxHeight?: string
  onToggle?: (state: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>

export const SideBar = forwardRef<HTMLDivElement, SidebarType>(
  (
    { onCreate, createLabel, onToggle, open = false, maxHeight, children },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(open)

    const handleToggle = () => {
      setIsOpen((o) => !o)
      onToggle?.(!isOpen)
    }

    return (
      <SideBarContext.Provider value={{ isOpen }}>
        <Container open={isOpen} ref={ref} maxHeight={maxHeight}>
          <TopContainer>
            {onCreate && createLabel && (
              <CreateItem
                isOpen={isOpen}
                createLabel={createLabel}
                onCreate={onCreate}
              />
            )}
            {children}
          </TopContainer>
          <ToggleOpen isOpen={isOpen} toggle={handleToggle} />
          <LogoContainer></LogoContainer>
        </Container>
      </SideBarContext.Provider>
    )
  },
)

SideBar.displayName = 'SideBar'
