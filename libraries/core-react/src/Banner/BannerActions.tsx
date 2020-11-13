import * as React from 'react'
import { FC, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const { enabled } = tokens

type BannerActionsPlacement = 'bottom' | 'left'

type StyledBannerActionsProps = {
  /** Where to place the actions */
  placement: BannerActionsPlacement
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

type BannerActionProps = {
  children: ReactNode
  placement?: BannerActionsPlacement
} & HTMLAttributes<HTMLDivElement>

export const BannerActions: FC<BannerActionProps> = ({
  children,
  placement = 'left',
  className,
  ...props
}) => {
  return (
    <StyledBannerActions {...props} placement={placement} className={className}>
      {children}
    </StyledBannerActions>
  )
}

// BannerActions.displayName = 'eds-banner-actions'
