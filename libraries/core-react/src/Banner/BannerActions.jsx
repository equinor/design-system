import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const { enabled } = tokens

const StyledBannerActions = styled.div`
  margin-left: ${enabled.spacings};
  grid-column: ${({ placement }) => (placement === 'bottom' ? '1/-1' : 'auto')};
  ${({ placement }) =>
    placement === 'bottom' && {
      marginTop: enabled.spacings,
      marginLeft: '0',
    }}
`

export const BannerActions = ({ children, placement, className, ...props }) => {
  return (
    <StyledBannerActions {...props} placement={placement} className={className}>
      {children}
    </StyledBannerActions>
  )
}

BannerActions.displayName = 'eds-banner-actions'

BannerActions.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Placement of the action button/s */
  placement: PropTypes.oneOf(['bottom', 'left']),
  /** @ignore */
  children: PropTypes.node.isRequired,
}

BannerActions.defaultProps = {
  className: undefined,
  placement: 'left',
}
