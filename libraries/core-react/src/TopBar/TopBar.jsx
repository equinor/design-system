import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

const {
  height,
  spacings,
  border,
  title: { text },
} = tokens

const StyledTopBar = styled.header`
  height: ${height};
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas: 'left center right';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)}
`

const Title = styled.h1`
  ${typographyTemplate(text)}
`

const LeftContent = styled.div``

const Left = styled.div`
  grid-area: left;
  display: flex;
  align-items: center;
  ${LeftContent} {
    margin-right: 24px;
  }
`
const Center = styled.div`
  grid-area: center;
  height: auto;
`

const Right = styled.div`
  grid-area: right;
  text-align: right;
`

export const TopBar = forwardRef(function EdsTopBar(
  { title, center, right, left, className, ...rest },
  ref,
) {
  const props = {}

  return (
    <StyledTopBar {...props} {...rest} className={className} ref={ref}>
      <Left>
        {left && <LeftContent>{left}</LeftContent>}
        <Title>{title}</Title>
      </Left>
      <Center>{center}</Center>
      <Right>{right}</Right>
    </StyledTopBar>
  )
})

TopBar.displayName = 'eds-topbar'

TopBar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  // Valid Title
  title: PropTypes.node,
  right: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  left: PropTypes.node,
}

TopBar.defaultProps = {
  className: '',
  title: 'medium',
  right: null,
  left: null,
  center: null,
}
