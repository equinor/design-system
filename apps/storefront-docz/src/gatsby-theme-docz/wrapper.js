/* eslint react/jsx-filename-extension: off  */
/* eslint react/jsx-pascal-case: off  */
import * as React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/seo'
// The doc prop contains some metadata about the page being rendered that you can use.
// Except that it is undefined :/
const Wrapper = ({ children }) => {
  return (
    <>
      <SEO />
      <Helmet>
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://eds-static.equinor.com/font/equinor-font.css"
        />
      </Helmet>
      {children}
    </>
  )
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Wrapper // eslint-disable-line
