import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  positionTemplate,
} from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

const {
  background,
  height,
  spacings,
  border,
  title: { text },
} = tokens

const StyledTopBar = styled.header`
  background: ${background};
  height: ${height};
  box-sizing: border-box;
  z-index: 1000;
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas: 'left center right';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)};
  ${positionTemplate}
`
const Gutter = styled.div`
  height: ${height};
`

const Title = styled.h1`
  ${typographyTemplate(text)}
`

const Left = styled.div`
  grid-area: left;
  display: flex;
  align-items: center;
  position: relative;

  > div {
    margin-right: 24px;
  }
`
const Center = styled.div`
  grid-area: center;
  height: auto;
  position: relative;
`

const Right = styled.div`
  grid-area: right;
  text-align: right;
  position: relative;
`

export const TopBar = forwardRef(function EdsTopBar(
  { title, center, right, left, className, position, ...rest },
  ref,
) {
  const props = { position }

  return (
    <Fragment>
      {position === 'fixed' && <Gutter />}
      <StyledTopBar {...props} {...rest} className={className} ref={ref}>
        <Left>
          {left && <div>{left}</div>}
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
  /** Position */
  position: PropTypes.oneOf(['static', 'fixed', 'sticky']),
}

TopBar.defaultProps = {
  className: '',
  title: '',
  right: null,
  left: null,
  center: null,
  position: 'fixed',
}
