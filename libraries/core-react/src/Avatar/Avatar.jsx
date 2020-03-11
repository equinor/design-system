import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { avatar as tokens } from './Avatar.tokens'

const {
  enabled: { border },
} = tokens

const StyledAvatar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${border.radius};
  ${({ size }) =>
    css`
      height: ${size}px;
      width: ${size}px;
    `}
`

const StyledImage = styled.img`
  height: 100%;
  text-align: center;
  color: transparent;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const Avatar = forwardRef(function Avatar(
  { src, alt, size, disabled, ...rest },
  ref,
) {
  const props = {
    ...rest,
    ref,
    size,
    disabled,
  }

  const imageProps = {
    src,
    alt,
    disabled,
  }

  return (
    <StyledAvatar {...props}>
      <StyledImage {...imageProps} />
    </StyledAvatar>
  )
})

Avatar.displayName = 'eds-avatar'

Avatar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Image source */
  src: PropTypes.string,
  /** Alt image description */
  alt: PropTypes.string,
  /** Size */
  size: PropTypes.oneOf([16, 24, 32, 40, 48]),
  /** Disabled */
  disabled: PropTypes.bool,
}

Avatar.defaultProps = {
  className: '',
  children: [],
  src: null,
  alt: null,
  size: 24,
  disabled: false,
}
