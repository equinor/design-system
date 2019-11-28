import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const LabelBase = styled.label`
  width: 100%;
  display: flex;
  justify-content: space-between;

  font-family: inherit;
  font-size: 12px;
  line-height: 16px;
  color: #6f6f6f;
`

const Text = styled.div``

const Label = (props) => {
  const { label, meta, inputId } = props

  return (
    <LabelBase htmlFor={inputId}>
      <Text>{label}</Text>
      <Text>{meta}</Text>
    </LabelBase>
  )
}

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
