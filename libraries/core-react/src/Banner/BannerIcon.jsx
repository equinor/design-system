import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const { enabled } = tokens
const StyledBannerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: ${enabled.icon.shape.borderRadius};
  background-color: ${({ color }) => color}
  width: ${enabled.icon.shape.minWidth};
  height: ${enabled.icon.shape.minHeight};
  margin-right: ${enabled.spacings};
`

export const BannerIcon = ({ children, color, className, ...props }) => {
  return (
    <StyledBannerIcon color={color} className={className} {...props}>
      {children}
    </StyledBannerIcon>
  )
}

BannerIcon.displayName = 'eds-banner-icon'

BannerIcon.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Color of icon background */
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

BannerIcon.defaultProps = {
  className: undefined,
  color: '#FFE0E7',
}
