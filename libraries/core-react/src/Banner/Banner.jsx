import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Divider } from '../Divider'

const { enabled } = tokens

const StyledBanner = styled.div``

const Content = styled.div`
  padding: ${enabled.spacings};
  display: grid;
  grid-template-columns: ${({ hasIcon }) =>
    hasIcon ? 'min-content 1fr auto' : '1fr auto'}
  align-items: center;
`

const NonMarginDivider = styled(Divider)`
  margin: 0;
  height: 2px;
`

export const Banner = ({ children, className, ...props }) => {
  const displayNames = React.Children.map(children, (child) => {
    /* return child.type?.displayName */
    return child.type && child.type.displayName
  })
  const hasIcon = displayNames.includes('eds-banner-icon')

  return (
    <StyledBanner {...props} className={className}>
      <Content hasIcon={hasIcon}>{children}</Content>
      <NonMarginDivider color="light" />
    </StyledBanner>
  )
}

Banner.displayName = 'eds-banner'

Banner.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Banner.defaultProps = {
  className: undefined,
}
