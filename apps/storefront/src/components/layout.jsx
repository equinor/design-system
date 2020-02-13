import React from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import 'github-markdown-css'
import { MDXProvider } from '@mdx-js/react'
import Header from './header'
import Sidebar from './Sidebar'
import Banner from './Banner'
import './layout.css'
// MDX components
import ComponentStatus from './ComponentStatus'
import Embed from './embed'
import Video from './video'
import FigmaImage from './figmaImage'
import IconsDownload from './Icons'

const mdxComponents = {
  ComponentStatus,
  Embed,
  Video,
  FigmaImage,
  IconsDownload,
}

const Layout = ({ children }) => (
  <MDXProvider components={mdxComponents}>
    <div className="Page">
      <Banner />
      <input id="MenuToggler" className="MenuToggler" type="checkbox" />
      <Header />
      <Location>{({ location }) => <Sidebar location={location} />}</Location>
      {/* <nav className="TOC">TOC</nav> */}
      <main className="Main markdown-body">{children}</main>
    </div>
  </MDXProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
