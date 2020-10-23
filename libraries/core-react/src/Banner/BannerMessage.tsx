import React, { FC } from 'react'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { Props as TypographyProps } from '../Typography/Typography'

const StyledBannerMessage = styled(Typography)``

export type BannerMessageProps = {
  /** Text content */
  children: string
} & Omit<TypographyProps, 'children'>

export const BannerMessage: FC<BannerMessageProps> = ({
  children,
  ...props
}) => {
  return (
    <StyledBannerMessage variant="body_long" {...props}>
      {children}
    </StyledBannerMessage>
  )
}

// BannerMessage.displayName = 'eds-banner-message'
