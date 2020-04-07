import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { avatar as tokens } from './Avatar.tokens'

const {
  enabled: { border },
  disabled: { image: disabledImage },
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

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: ${disabledImage.opacity};
    `};
`

/**
 * @typedef Props
 * @prop {string} [className]
 * @prop {React.ReactNode} [children]
 * @prop {string} [src] Image source
 * @prop {string} alt Alt image description
 * @prop {16 | 24 | 32 | 40 | 48} [size] Size
 * @prop {boolean} [disabled] Disabled
 */

export const Avatar = forwardRef(
  /**
   * @param {Props} props
   * @param ref
   */
  function EdsAvatar({ src, alt, size, disabled, ...rest }, ref) {
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
  },
)

Avatar.displayName = 'eds-avatar'

Avatar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Image source */
  src: PropTypes.string,
  /** Alt image description */
  alt: PropTypes.string.isRequired,
  /** Size */
  // @ts-ignore
  size: PropTypes.oneOf([16, 24, 32, 40, 48]),
  /** Disabled */
  disabled: PropTypes.bool,
}

Avatar.defaultProps = {
  className: '',
  children: [],
  src: null,
  // @ts-ignore
  size: 24,
  disabled: false,
}
