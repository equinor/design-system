import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import Sidebar from './sidebar'
import './layout.css'

const Layout = ({ children, location }) => (
    <StaticQuery
        query={graphql`
            query SiteTitleQuery {
                site {
                    siteMetadata {
                        title
                    }
                }
            }
        `}
        render={data => (
            <div className="Page">
                <input id="MenuToggler" className="MenuToggler" type="checkbox" />
                <Header />
                <Sidebar location={ location } />
                <nav className="TOC">TOC</nav>
                <main className="Main">
                    {children}
                </main>
            </div>
        )}
    />
)

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
