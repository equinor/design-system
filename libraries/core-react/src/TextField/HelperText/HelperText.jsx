// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../../_common/templates'
import { helperText as tokens } from './HelperText.token'
import { propsFor, useTextField } from '../context'
import { Icon } from '../Icon'

const Variation = ({ variant, isFocused, isDisabled }) => {
  if (!variant) {
    return ``
  }

  const { focus, color, disabledColor } = variant

  if (isDisabled) {
    return `color: ${disabledColor};`
  }

  if (isFocused) {
    return ` color: ${focus.color};`
  }

  return `color: ${color};`
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

const StyledIcon = styled(Icon)`
  margin-right: ${({ spacings }) => spacings.left};
`

const HelperText = React.forwardRef(function TextFieldHelperText(props, ref) {
  const { helperText, icon, variant, disabled: isDisabled } = props
  const helperVariant = tokens[variant]
  const spacings = tokens.spacings.comfortable

  const { isFocused } = useTextField()

  const iconProps = {
    spacings,
    isDisabled,
    color: helperVariant.color,
    disabledColor: helperVariant.disabledColor,
    focusColor: helperVariant.focus.color,
  }

  return (
    <Container ref={ref} {...props} spacings={spacings}>
      {icon && <StyledIcon {...iconProps}>{icon}</StyledIcon>}
      <Text
        variant={helperVariant}
        isFocused={isFocused}
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
  /** Helper text */
  helperText: PropTypes.string,
  /** Icon */
  icon: PropTypes.node,
  /** Disabled */
  disabled: PropTypes.bool,
  /** Variant */
  variant: PropTypes.oneOf(propsFor.variants),
}

HelperText.defaultProps = {
  className: '',
  helperText: '',
  icon: null,
  disabled: false,
  variant: 'default',
}

HelperText.displayName = 'eds-text-field-helperText'

export { HelperText }
