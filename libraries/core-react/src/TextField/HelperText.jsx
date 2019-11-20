import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const HelperTextBase = styled.div`
  margin-top: 8px;
`
const Text = styled.div`
  font-family: inherit;
  font-size: 12px;
  line-height: 16px;
  color: #6f6f6f;
`

const Icon = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 8px;
`

const HelperText = (props) => {
  const { text, icon } = props

  return (
    <HelperTextBase {...props}>
      {icon && <Icon>{icon}</Icon>}
      <Text>{text}</Text>
    </HelperTextBase>
  )
}

HelperText.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Helper text */
  text: PropTypes.string,
  /** Icon */
  icon: PropTypes.node,
}

HelperText.defaultProps = {
  className: '',
}

HelperText.displayName = 'text-field-helperText'

export default HelperText
