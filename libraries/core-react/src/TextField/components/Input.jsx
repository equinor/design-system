import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import baseTokens from '@equinor/eds-tokens/base'
import { typographyTemplate } from '../../_common/templates'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = baseTokens

const spacings = {
  comfortable: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: '6px',
    bottom: '6px',
  },
  compact: {
    left: spacings_.comfortable.x_small,
    right: spacings_.comfortable.x_small,
    top: spacings_.comfortable.x_small,
    bottom: spacings_.comfortable.x_small,
  },
}

const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.text,
  color: colors_.text.static_icons__default.hex,
  spacings,
  default: {
    borderBottom: colors_.text.static_icons__tertiary.hex,
    border: {
      color: 'transparent',
      width: '1px',
    },
    focus: {
      border: {
        width: '2px',
        color: colors_.interactive.primary__resting.hex,
      },
    },
  },
  error: {
    borderBottom: 'transparent',
    border: {
      color: colors_.interactive.danger__resting.hex,
      width: '1px',
    },
    focus: {
      border: {
        width: '2px',
        color: colors_.interactive.danger__hover.hex,
      },
    },
  },
  warning: {
    borderBottom: 'transparent',
    border: {
      color: colors_.interactive.warning__resting.hex,
      width: '1px',
    },
    focus: {
      border: {
        width: '2px',
        color: colors_.interactive.warning__hover.hex,
      },
    },
  },
  success: {
    borderBottom: 'transparent',
    border: {
      color: colors_.interactive.success__resting.hex,
      width: '1px',
    },
    focus: {
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

    &:focus,
    &:active {
      outline: none;
    }
  }

`
}

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;

  background: ${tokens.background};
  padding-left: ${({ spacings }) => spacings.left};
  padding-right: ${({ spacings }) => spacings.right};
  padding-top: ${({ spacings }) => spacings.top};
  padding-bottom: ${({ spacings }) => spacings.bottom};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

  ${Variation}

`

const TextFieldInput = React.forwardRef((props, ref) => {
  const {
    children,
    multiline,
    validation,
    updateIsFocused,
    compact,
    ...other
  } = props
  const as = multiline ? 'textarea' : 'input'
  const variant = tokens[validation || 'default']
  const spacings = compact
    ? tokens.spacings.compact
    : tokens.spacings.comfortable

  return (
    <Input
      ref={ref}
      as={as}
      variant={variant}
      type="text"
      onFocus={() => updateIsFocused(true)}
      onBlur={() => updateIsFocused(false)}
      spacings={spacings}
      {...other}
    >
      {children}
    </Input>
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
  type: PropTypes.oneOf(['text', 'search', 'password', 'email', 'numbers']),
  /** Multiline input */
  multiline: PropTypes.bool,
  /** Validation state */
  validation: PropTypes.oneOf(['error', 'warning', 'success', '']),
}

TextFieldInput.defaultProps = {
  className: '',
  validation: '',
}

TextFieldInput.displayName = 'text-field-input'

export default TextFieldInput
