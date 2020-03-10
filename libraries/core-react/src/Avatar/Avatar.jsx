import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { avatar as tokens } from './Avatar.tokens'

const {} = tokens

const StyledAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  overflow: hidden;
  border-radius: 50%;
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  text-align: center;
  text-indent: 10000;
  color: transparent;
`

export const Avatar = forwardRef(function Avatar({ src, alt, ...rest }, ref) {
  const props = {
    ...rest,
    ref,
  }

  const imageProps = {
    src,
    alt,
  }

  return (
    <StyledAvatar {...props}>
      <StyledImage {...imageProps} />
    </StyledAvatar>
  )
})

Avatar.displayName = 'eds-chip'

Avatar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Image source */
  src: PropTypes.string,
  /** Alt image description */
  alt: PropTypes.string,
}

Avatar.defaultProps = {
  className: '',
  children: [],
  src: null,
  alt: null,
}
