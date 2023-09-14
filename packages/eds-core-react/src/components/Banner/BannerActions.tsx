import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { styled, css } from 'styled-components'

type BannerActionsPlacement = 'bottom' | 'left'

type StyledBannerActionsProps = {
  /** Where to place the actions */
  $placement: BannerActionsPlacement
}

const StyledBannerActions = styled.div<StyledBannerActionsProps>(
  ({ theme, $placement }) => {
    return css`
      display: flex;
      margin-left: ${theme.spacings.left};
      grid-gap: 8px;
      grid-column: ${$placement === 'bottom' ? '1/-1' : 'auto'};
      ${$placement === 'bottom' && {
        marginTop: theme.spacings.top,
        marginLeft: '0',
      }}
    `
  },
)

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
      <StyledBannerActions $placement={placement} {...props}>
        {children}
      </StyledBannerActions>
    )
  },
)
