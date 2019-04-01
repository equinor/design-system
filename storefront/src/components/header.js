import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ siteTitle }) => (
    <div class="Header">
        <label class="Burger" for="MenuToggler"></label>
        <h1 class="Header-title">
            <Link to="/">
                {siteTitle}
            </Link>
        </h1>
    </div>
)

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: '',
}

export default Header
