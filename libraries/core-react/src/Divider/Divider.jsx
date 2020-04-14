import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { divider as tokens } from './Divider.tokens'

const StyledDivider = styled.hr(
  ({ backgroundColor, marginTop, marginBottom, dividerHeight: height }) => ({
    backgroundColor,
    marginTop,
    marginBottom,
    height,
    border: 'none',
  }),
)

/**
 * @typedef Props
 * @prop {'lighter' | 'light' | 'medium'} [color] Valid colors
 * @prop {'small' | 'medium'} [variant] Vertical spacing
 */

export const Divider = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLHRElement>} props
   * @param ref
   */
  function Divider({ color, variant, className }, ref) {
    const props = {
      backgroundColor: tokens.color[color],
      marginTop: tokens[variant].spacings.top,
      marginBottom: tokens[variant].spacings.bottom,
      dividerHeight: tokens.height,
    }

    return <StyledDivider {...props} className={className} ref={ref} />
  },
)

Divider.displayName = 'eds-divider'

Divider.propTypes = {
  // Valid colors
  // @ts-ignore
  color: PropTypes.oneOf(['lighter', 'light', 'medium']),
  // Vertical spacing
  // @ts-ignore
  variant: PropTypes.oneOf(['small', 'medium']),
  /** @ignore */
  className: PropTypes.string,
}

Divider.defaultProps = {
  // @ts-ignore
  color: 'medium',
  // @ts-ignore
  variant: 'medium',
  className: '',
}
