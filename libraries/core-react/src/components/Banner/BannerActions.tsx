import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import * as tokens from './Banner.tokens'

const { enabled } = tokens

type BannerActionsPlacement = 'bottom' | 'left'

type StyledBannerActionsProps = {
  /** Where to place the actions */
  placement: BannerActionsPlacement
}

const StyledBannerActions = styled.div<StyledBannerActionsProps>`
  display: flex;
  margin-left: ${enabled.spacings.left};
  grid-gap: 8px;
  grid-column: ${({ placement }) => (placement === 'bottom' ? '1/-1' : 'auto')};
  ${({ placement }) =>
    placement === 'bottom' && {
      marginTop: enabled.spacings.top,
      marginLeft: '0',
    }}
`

export type BannerActionsProps = {
  children: ReactNode
  placement?: BannerActionsPlacement
} & HTMLAttributes<HTMLDivElement>

export const BannerActions = forwardRef<HTMLDivElement, BannerActionsProps>(
  function BannerActions({ children, placement = 'left', ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }
    return (
      <StyledBannerActions placement={placement} {...props}>
        {children}
      </StyledBannerActions>
    )
  },
)
