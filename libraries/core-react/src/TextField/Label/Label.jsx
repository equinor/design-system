import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../../_common/templates'
import { label as tokens } from './Label.tokens'

const LabelBase = styled.label`
  display: flex;
  justify-content: space-between;
  position: relative;

  margin-left: ${tokens.spacings.left};
  margin-right: ${tokens.spacings.right};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

`

const Text = styled.p`
  margin: 0;
`

const Label = React.forwardRef(function TextFieldLabel(props, ref) {
  const { label, meta, inputId } = props

  return (
    <LabelBase ref={ref} htmlFor={inputId}>
      <Text>{label}</Text>
      <Text>{meta}</Text>
    </LabelBase>
  )
})

Label.propTypes = {
  /** Label text */
  label: PropTypes.string,
  /** Meta text */
  meta: PropTypes.string,
  /** Id of input for `for` */
  inputId: PropTypes.string.isRequired,
}

Label.defaultProps = {
  label: '',
  meta: '',
}

Label.displayName = 'eds-text-field-label'

export { Label }
