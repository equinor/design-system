/* eslint react/jsx-filename-extension: off  */
import React from 'react'
import PropTypes from 'prop-types'

export const MainContainer = ({ children, ...rest }) => {
  return (
    <main {...rest} id="main">
      {children}
    </main>
  )
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
}
