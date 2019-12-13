import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../../_common/templates'
import { tokens } from './HelperText.token'

const Variation = ({ variant, isFocused, isDisabled }) => {
  if (!variant) {
    return ``
  }

  const { focus, color, disabledColor } = variant

  if (isDisabled) {
    return `
    color: ${disabledColor};
    fill: ${disabledColor};
    `
  }

  if (isFocused) {
    return `
    color: ${focus.color};
    fill: ${focus.color};
    `
  }

  return `
  color: ${color};
  fill: ${color};
`
}

const Container = styled.div`
  display: flex;
  align-items: flex-end;

  margin-left: ${({ spacings }) => spacings.left};
  margin-top: ${({ spacings }) => spacings.top};
`
const Text = styled.p`
  margin: 0;
  ${typographyTemplate(tokens.typography)}
  ${Variation}
`

const Icon = styled.div`
  margin-right: ${({ spacings }) => spacings.left};

  height: 16px;
  width: 16px;
  ${Variation}
`

const HelperText = React.forwardRef(function TextFieldHelperText(props, ref) {
  const { helperText, icon, variant, disabled: isDisabled, textField } = props
  const variant_ = tokens[variant]
  const spacings = props.compact
    ? tokens.spacings.compact
    : tokens.spacings.comfortable

  return (
    <Container ref={ref} {...props} spacings={spacings}>
      {icon && (
        <Icon
          variant={variant_}
          isFocused={textField.isFocused}
          isDisabled={isDisabled}
          spacings={spacings}
        >
          {icon}
        </Icon>
      )}
      <Text
        variant={variant_}
        isFocused={textField.isFocused}
        isDisabled={isDisabled}
      >
        {helperText}
      </Text>
    </Container>
  )
})

HelperText.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Helper text */
  helperText: PropTypes.string,
  /** Icon */
  icon: PropTypes.node,
  /** Textfield state */
  textField: PropTypes.object,
}

HelperText.defaultProps = {
  className: '',
}

HelperText.displayName = 'text-field-helperText'

export { HelperText }
