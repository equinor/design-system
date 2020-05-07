import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledRadio = styled.input.attrs(({ type = 'radio' }) => ({
  type,
}))``

export const Radio = ({}) => {
  return <StyledRadio />
}
