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
  background-color: ${({ variant }) =>
    variant === 'warning'
      ? enabled.icon.warning.background
      : enabled.icon.info.background};
  width: ${enabled.icon.shape.minWidth};
  height: ${enabled.icon.shape.minHeight};
  margin-right: ${enabled.spacings};
`

export const BannerIcon = ({ children, variant, ...props }) => {
  const childrenWithColor = React.Children.map(children, (child) => {
    const color =
      variant === 'warning'
        ? enabled.icon.warning.color
        : enabled.icon.warning.info
    return (
      (child.type.displayName === 'eds-icon' &&
        React.cloneElement(child, {
          color,
        })) ||
      child
    )
  })
  return (
    <StyledBannerIcon variant={variant} {...props}>
      {childrenWithColor}
    </StyledBannerIcon>
  )
}

BannerIcon.displayName = 'eds-banner-icon'

BannerIcon.propTypes = {
  /** Variant of icon  */
  variant: PropTypes.oneOf(['info', 'warning']),
  children: PropTypes.node.isRequired,
}

BannerIcon.defaultProps = {
  variant: 'info',
}
