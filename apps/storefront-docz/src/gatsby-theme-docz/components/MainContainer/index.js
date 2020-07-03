/* eslint react/jsx-filename-extension: off  */
import React from 'react'
import PropTypes from 'prop-types'
import { useDocs } from 'docz'

export const MainContainer = ({ children, ...rest }) => {
  const components = useDocs()
  console.log('docs', components)
  return (
    <main {...rest} id="main">
      {children}
    </main>
  )
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
}
