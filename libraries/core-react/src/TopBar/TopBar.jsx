import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate } from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

const { height, spacings, border } = tokens

const StyledTopBar = styled.div`
  height: ${height};
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)}
`

export const TopBar = forwardRef(function EdsTopBar(
  { title, className, ...rest },
  ref,
) {
  const props = {}

  return (
    <StyledTopBar {...props} {...rest} className={className} ref={ref}>
      <div>{title}</div>
      <div>Search-bar</div>
      <div>Icons</div>
    </StyledTopBar>
  )
})

TopBar.displayName = 'eds-topbar'

TopBar.propTypes = {
  // Valid colors
  title: PropTypes.string,
  /** @ignore */
  className: PropTypes.string,
}

TopBar.defaultProps = {
  title: 'medium',
  className: '',
}
