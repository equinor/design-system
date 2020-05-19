import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { propsFor, useTextField } from '../context'

const IconVariation = ({
  color,
  focusColor,
  disabledColor,
  isDisabled,
  isFocused,
}) => {
  let color_ = color
  if (isDisabled) {
    color_ = disabledColor
  }
  if (isFocused) {
    color_ = focusColor
  }
  return `fill: ${color_};`
}

const StyledIcon = styled.div`
  width: 16px;
  height: 16px;
  ${IconVariation}
`

/**
 * @typedef {object} Props
 * @prop {React.ReactNode} [children]
 * @prop {string} [className]
 * @prop {typeof propsFor.variants[number]} [variant]
 * @prop {string} [disabledColor]
 * @prop {string} [focusColor]
 * @prop {string} [color]
 */

const Icon = React.forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function TextFieldIcon(props, ref) {
    const { children, ...other } = props
    const { isFocused } = useTextField()

    return (
      <StyledIcon ref={ref} isFocused={isFocused} {...other}>
        {children}
      </StyledIcon>
    )
  },
)

Icon.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
  /** Variant */
  variant: PropTypes.oneOf(propsFor.variants),
  /** Disabled color */
  disabledColor: PropTypes.string,
  /** Focus color */
  focusColor: PropTypes.string,
  /** Color */
  color: PropTypes.string,
}

Icon.defaultProps = {
  children: null,
  className: '',
  variant: 'default',
  disabledColor: '',
  focusColor: '',
  color: '',
}

Icon.displayName = 'eds-text-field-icon'

export { Icon }
