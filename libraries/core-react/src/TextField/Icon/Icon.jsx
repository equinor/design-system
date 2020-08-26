// @ts-nocheck
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

const Icon = React.forwardRef(function TextFieldIcon(props, ref) {
  const { children, ...other } = props
  const { isFocused } = useTextField()

  return (
    <StyledIcon ref={ref} isFocused={isFocused} {...other}>
      {children}
    </StyledIcon>
  )
})

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
