import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCode = styled.code`
  background: #f7f7f7;
  border: 1px solid #ebebeb;
`

const Code = ({ children }) => {
  console.log('§fdlkfjdslfjldsfjlksdjflksdjf')
  return <StyledCode>{children}</StyledCode>
}

Code.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Code //eslint-disable-line
