// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

const StyledBannerMessage = styled(Typography)``

export const BannerMessage = ({ children, ...props }) => {
  return (
    <StyledBannerMessage variant="body_long" {...props}>
      {children}
    </StyledBannerMessage>
  )
}

BannerMessage.displayName = 'eds-banner-message'

BannerMessage.propTypes = {
  /** Text content */
  children: PropTypes.string.isRequired,
}
