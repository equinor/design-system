import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const StyledBanner = styled.div``

export const Banner = ({ children, className, ...props }) => {
  return (
    <StyledBanner {...props} className={className}>
      {children}
    </StyledBanner>
  )
}

Banner.displayName = 'eds-banner'

Banner.propTypes = {
  /** @ignore */
  className: PropTypes.string,
}

Banner.defaultProps = {
  className: undefined,
}
