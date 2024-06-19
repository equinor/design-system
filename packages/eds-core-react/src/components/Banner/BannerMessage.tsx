import { forwardRef } from 'react'
import styled from 'styled-components'
import { Typography, TypographyProps } from '../Typography'

const StyledBannerMessage = styled(Typography)``

export type BannerMessageProps = {
  /** Text content */
  children: string
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
