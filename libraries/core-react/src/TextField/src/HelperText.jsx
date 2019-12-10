import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import baseTokens from '@equinor/eds-tokens/base'
import { typographyTemplate } from '../../_common/templates'
import { TextFieldContext } from './context'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = baseTokens

const spacings = {
  comfortable: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: spacings_.comfortable.small,
    bottom: '6px',
  },
  compact: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: spacings_.comfortable.xx_small,
    bottom: '6px',
  },
}
const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.helper,
  spacings,
  default: {
    color: colors_.text.static_icons__tertiary.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.text.static_icons__tertiary.hex,
    },
  },
  error: {
    color: colors_.interactive.danger__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.danger__hover.hex,
    },
  },
  warning: {
    color: colors_.interactive.warning__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.warning__hover.hex,
    },
  },
  success: {
    color: colors_.interactive.success__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.success__hover.hex,
    },
  },
}

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
  const { helperText, icon, variant, disabled: isDisabled } = props
  const variant_ = tokens[variant]
  const spacings = props.compact
    ? tokens.spacings.compact
    : tokens.spacings.comfortable

  return (
    <TextFieldContext.Consumer>
      {(textField) => (
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
      )}
    </TextFieldContext.Consumer>
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
}

HelperText.defaultProps = {
  className: '',
}

HelperText.displayName = 'text-field-helperText'

export { HelperText }
