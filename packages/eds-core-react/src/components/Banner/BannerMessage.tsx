import { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { TypographyProps } from '../Typography/Typography'

const StyledBannerMessage = styled(Typography)``

export type BannerMessageProps = {
  /** Content */
  children: ReactNode
} & Omit<TypographyProps, 'children'>

export const BannerMessage = forwardRef<HTMLElement, BannerMessageProps>(
  function BannerMessage({ children, ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }

    return (
      <StyledBannerMessage variant="body_long" {...props}>
        {children}
      </StyledBannerMessage>
    )
  },
)
