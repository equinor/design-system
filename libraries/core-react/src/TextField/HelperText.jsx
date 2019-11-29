import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import baseTokens from '@equinor/eds-tokens/base'
import { typographyTemplate } from '../_common/templates'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = baseTokens

const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.helper,
  spacings: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: spacings_.comfortable.small,
    bottom: '6px',
  },
  default: {
    color: colors_.text.static_icons__tertiary.hex,
    focus: {
      color: colors_.text.static_icons__tertiary.hex,
    },
  },
  error: {
    color: colors_.interactive.danger__resting.hex,
    focus: {
      color: colors_.interactive.danger__hover.hex,
    },
  },
  warning: {
    color: colors_.interactive.warning__resting.hex,
    focus: {
      color: colors_.interactive.warning__hover.hex,
    },
  },
  success: {
    color: colors_.interactive.success__resting.hex,
    focus: {
      color: colors_.interactive.success__hover.hex,
    },
  },
}

const Variation = ({ variant }) => {
  if (!variant) {
    return ``
  }

  const { focus, color } = variant

  return `
  color: ${color};
  fill: ${color};

   &:active,
  &:focus {
    color: ${focus.color};
    fill: ${color};
  }
`
}

const HelperTextBase = styled.div`
  margin-top: ${tokens.spacings.top};
  margin-left: ${tokens.spacings.left};
`
const Text = styled.div`
  ${typographyTemplate(tokens.typography)}
  ${Variation}
`

const Icon = styled.div`
  height: 16px;
  width: 16px;
  ${Variation}
`

const HelperText = (props) => {
  const { helperText, icon, validation } = props
  const variant = tokens[validation || 'default']

  return (
    <HelperTextBase {...props}>
      {icon && <Icon variant={variant}>{icon}</Icon>}
      <Text variant={variant}>{helperText}</Text>
    </HelperTextBase>
  )
}

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

export default HelperText
