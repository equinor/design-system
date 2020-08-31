import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

const StyledBannerMessage = styled(Typography)``

export type BannerMessageProps = {
  children: string
}

export const BannerMessage = ({ children, ...props }: BannerMessageProps) => {
  return (
    // @ts-ignore
    <StyledBannerMessage variant="body_long" {...props}>
      {children}
    </StyledBannerMessage>
  )
}

BannerMessage.displayName = 'BannerMessage'

BannerMessage.propTypes = {
  /** Text content */
  children: PropTypes.string.isRequired,
}
