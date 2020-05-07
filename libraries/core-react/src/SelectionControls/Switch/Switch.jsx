import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledSwitch = styled.button.attrs(({ type = 'button' }) => ({
  type,
}))``

export const Switch = ({}) => {
  return <StyledSwitch />
}
