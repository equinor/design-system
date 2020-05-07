import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCheckbox = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))``

export const Checkbox = ({}) => {
  return <StyledCheckbox />
}
