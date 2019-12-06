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
  color: colors_.text.static_icons__tertiary.hex,
  typography: typography_.input.label,
  spacings: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: '6px',
    bottom: '6px',
  },
}

const LabelBase = styled.label`
  display: flex;
  justify-content: space-between;
  position: relative;

  margin-left: ${tokens.spacings.left};
  margin-right: ${tokens.spacings.right};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

`

const Text = styled.div``

const Label = React.forwardRef((props, ref) => {
  const { label, meta, inputId } = props

  return (
    <LabelBase ref={ref} htmlFor={inputId}>
      <Text>{label}</Text>
      <Text>{meta}</Text>
    </LabelBase>
  )
})

Label.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Label text */
  label: PropTypes.string,
  /** Meta text */
  meta: PropTypes.string,
  /** Id of input for `for` */
  inputId: PropTypes.string,
}

Label.defaultProps = {
  className: '',
}

Label.displayName = 'text-field-label'

export default Label
