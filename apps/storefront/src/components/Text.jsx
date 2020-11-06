import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const StyledTypography = styled(Typography)`
  margin-top: 1em;
  margin-bottom: 1em;
`

const Text = ({ children, ...props }) => {
  return (
    <StyledTypography {...props} variant="body_long">
      {children}
    </StyledTypography>
  )
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Text // eslint-disable-line
