import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

const StyledBannerMessage = styled(Typography)``

export const BannerMessage = ({ children, className, ...props }) => {
  return (
    <StyledBannerMessage variant="body_long" className={className} {...props}>
      {children}
    </StyledBannerMessage>
  )
}

BannerMessage.displayName = 'eds-banner-message'

BannerMessage.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Text content */
  children: PropTypes.string.isRequired,
}

BannerMessage.defaultProps = {
  className: undefined,
}
