import { Link, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = () => {

    const data = useStaticQuery(graphql`
        query HeaderQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (<div className="Header">
        <label className="Burger" htmlFor="MenuToggler"></label>
        <h1 className="Header-title">
            <Link to="/" className="Header-link">
                {data.site.siteMetadata.title}
            </Link>
        </h1>
    </div>)
}

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: '',
}

export default Header
