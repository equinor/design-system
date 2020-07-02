/* eslint react/jsx-filename-extension: off  */
import React from 'react'
import PropTypes from 'prop-types'
import * as styles from './styles'

export const MainContainer = ({ children, ...rest }) => {
  return (
    <main sx={styles.container} {...rest} id="main">
      {children}
    </main>
  )
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
}
