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
`

const TextFieldInput = React.forwardRef(function TextFieldInput(props, ref) {
  const {
    children,
    multiline,
    variant,
    updateIsFocused,
    compact,
    inputIcon,
    ...other
  } = props
  const as = multiline ? 'textarea' : 'input'
  const variant_ = tokens[variant]
  const spacings = compact
    ? tokens.spacings.compact
    : tokens.spacings.comfortable

  return (
    <Container>
      <Input
        as={as}
        onBlur={() => updateIsFocused(false)}
        onFocus={() => updateIsFocused(true)}
        ref={ref}
        spacings={spacings.input}
        type="text"
        variant={variant_}
        {...other}
      ></Input>
      <Icon spacings={spacings.icon}>{inputIcon}</Icon>
    </Container>
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
}

TextFieldInput.defaultProps = {
  className: '',
}

TextFieldInput.displayName = 'text-field-input'

export { TextFieldInput }
