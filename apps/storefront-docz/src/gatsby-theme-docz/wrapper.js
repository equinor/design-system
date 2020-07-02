/* eslint react/jsx-filename-extension: off  */
import * as React from 'react'
import { Helmet } from 'react-helmet-async'

// The doc prop contains some metadata about the page being rendered that you can use.
const Wrapper = ({ children, doc }) => (
  <React.Fragment>
    <Helmet>
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="https://eds-static.equinor.com/font/equinor-font.css"
      />
    </Helmet>
    {children}
  </React.Fragment>
)
export default Wrapper
