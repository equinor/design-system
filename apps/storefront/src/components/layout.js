import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { Location } from '@reach/router'
import Header from './header'
import Sidebar from './Sidebar'
import './layout.css'
import 'github-markdown-css'

const Layout = ({ children }) => (
  <div className="Page">
    <input id="MenuToggler" className="MenuToggler" type="checkbox" />
    <Header />
    <Location>{({ location }) => <Sidebar location={location} />}</Location>
    {/* <nav className="TOC">TOC</nav> */}
    <main className="Main markdown-body">{children}</main>
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
