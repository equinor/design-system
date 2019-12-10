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
    input: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
      top: '6px',
      bottom: '6px',
    },
    icon: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
      top: '10px',
      bottom: '10px',
    },
  },
  compact: {
    input: {
      left: spacings_.comfortable.x_small,
      right: spacings_.comfortable.x_small,
      top: spacings_.comfortable.x_small,
      bottom: spacings_.comfortable.x_small,
    },
    icon: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
      top: '10px',
      bottom: '10px',
    },
  },
}

const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.text,
  color: colors_.text.static_icons__default.hex,
  spacings,
  default: {
    borderBottom: colors_.text.static_icons__tertiary.hex,
    icon: {
      color: colors_.text.static_icons__tertiary.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: 'transparent',
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.primary__resting.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.primary__resting.hex,
      },
    },
  },
  error: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.danger__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.danger__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.danger__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.danger__hover.hex,
      },
    },
  },
  warning: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.warning__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.warning__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.warning__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.warning__hover.hex,
      },
    },
  },
  success: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.success__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.success__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.success__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.success__hover.hex,
      },
    },
  },
}

const Variation = ({ variant }) => {
  if (!variant) {
    return ``
  }

  const { focus, border, borderBottom } = variant

  return `
  border-bottom: 1px solid ${borderBottom};
  outline: ${border.width} solid ${border.color};

  &:active,
  &:focus {
    outline-offset:0;
    border-bottom: 1px solid transparent;
    outline: ${focus.border.width} solid ${focus.border.color};

  }

  &:disabled {
    cursor: not-allowed;
    border-bottom: 1px solid transparent;
    outline: none;

    &:focus,
    &:active {
      outline: none;
    }
  }
`
}

const IconVariation = ({ variant, isDisabled, isFocused }) => {
  if (!variant) {
    return ``
  }

  const { icon, focus } = variant

  if (isDisabled) {
    return `
    fill: ${icon.disabledColor};
    `
  }

  if (isFocused) {
    return `
    fill: ${focus.icon.color};
    `
  }
  return `
  fill: ${icon.color};
`
}

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;

  display:grid;
  grid-template-columns: repeat(2, 1fr);

  background: ${tokens.background};
  padding-left: ${({ spacings }) => spacings.left};
  padding-right: ${({ spacings }) => spacings.right};
  padding-top: ${({ spacings }) => spacings.top};
  padding-bottom: ${({ spacings }) => spacings.bottom};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

  ${Variation}
`

const Container = styled.div`
  position: relative;
`

const Icon = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};

  ${IconVariation}
`

const TextFieldInput = React.forwardRef(function TextFieldInput(props, ref) {
  const {
    children,
    multiline,
    variant,
    updateIsFocused,
    compact,
    inputIcon,
    disabled,
    ...other
  } = props

  const as = multiline ? 'textarea' : 'input'
  const variant_ = tokens[variant]
  let spacings = compact ? tokens.spacings.compact : tokens.spacings.comfortable

  if (inputIcon) {
    spacings = {
      ...spacings,
      input: {
        ...spacings.input,
        right: spacings_.comfortable.x_large,
      },
    }
  }

  return (
    <TextFieldContext.Consumer>
      {(textField) => (
        <Container>
          <Input
            as={as}
            onBlur={() => updateIsFocused(false)}
            onFocus={() => updateIsFocused(true)}
            ref={ref}
            spacings={spacings.input}
            type="text"
            variant={variant_}
            disabled={disabled}
            {...other}
          ></Input>
          {inputIcon && (
            <Icon
              spacings={spacings.icon}
              variant={variant_}
              isDisabled={disabled}
              isFocused={textField.isFocused}
            >
              {inputIcon}
            </Icon>
          )}
        </Container>
      )}
    </TextFieldContext.Consumer>
  )
})

TextFieldInput.propTypes = {
  /** Specifies if text should be bold */
  multiline: PropTypes.bool,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf(['text', 'search', 'password', 'email', 'number']),
  /** Multiline input */
  multiline: PropTypes.bool,
}

TextFieldInput.defaultProps = {
  className: '',
}

TextFieldInput.displayName = 'text-field-input'

export { TextFieldInput }
