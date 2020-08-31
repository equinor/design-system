import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const { enabled } = tokens

type StyledBannerActionsProps = {
  placement: string
}

const StyledBannerActions = styled.div<StyledBannerActionsProps>`
  margin-left: ${enabled.spacings};
  grid-column: ${({ placement }) => (placement === 'bottom' ? '1/-1' : 'auto')};
  ${({ placement }) =>
    placement === 'bottom' && {
      marginTop: enabled.spacings,
      marginLeft: '0',
    }}
`

export type BannerActionsProps = {
  /** Placement of the action button/s */
  placement?: 'bottom' | 'left'
  /** Children, one or two actions */
  children: ReactNode | ReactNode[]
  className?: string
}

export const BannerActions = ({
  children,
  placement = 'left',
  className = undefined,
}: BannerActionsProps) => {
  return (
    <StyledBannerActions placement={placement} className={className}>
      {children}
    </StyledBannerActions>
  )
}

BannerActions.displayName = 'BannerActions'
