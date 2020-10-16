// @ts-nocheck
import React, { Children } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'

const StyledSnackbarAction = styled.div`
  display: inline-flex;
  margin-left: ${tokens.spacings.actionSpace};
  margin-top: -10px;
  margin-bottom: -10px;
`

export const SnackbarAction = ({ children }) => {
  return <StyledSnackbarAction>{Children.only(children)}</StyledSnackbarAction>
}

SnackbarAction.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
}
