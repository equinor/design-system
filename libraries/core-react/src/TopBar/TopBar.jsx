import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

const {
  background,
  height,
  spacings,
  border,
  title: { text },
} = tokens

const StyledTopBar = styled.header`
  height: ${height};
  position: sticky;
  background: ${background};
  box-sizing: border-box;
  z-index: 1000;
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'left center right';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)};
`

const Title = styled.h1`
  ${typographyTemplate(text)}
`

const Left = styled.div`
  grid-area: left;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 24px;
  align-items: center;
`
const Center = styled.div`
  grid-area: center;
  text-align: center;
`

const Right = styled.div`
  grid-area: right;
  text-align: right;
`

export const TopBar = forwardRef(function EdsTopBar(
  { title, center, right, left, className, ...rest },
  ref,
) {
  const props = { className, ref }

  return (
    <Fragment>
      <StyledTopBar {...props} {...rest}>
        <Left>
          {left && <Fragment>{left}</Fragment>}
          <Title>{title}</Title>
        </Left>
        <Center>{center}</Center>
        <Right>{right}</Right>
      </StyledTopBar>
    </Fragment>
  )
})

TopBar.displayName = 'eds-topbar'

TopBar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Title content */
  title: PropTypes.node,
  /** Right content */
  right: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** Center content */
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** Left content */
  left: PropTypes.node,
}

TopBar.defaultProps = {
  className: '',
  title: '',
  right: null,
  left: null,
  center: null,
}
