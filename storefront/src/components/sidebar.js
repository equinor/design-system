import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classNames from 'classnames'

const Sidebar = ({ location }) => {

    /**
     * The sidebar is manual for the time being
     */

    const categories = ['getting-started', 'guidelines', 'components']

    const isCurrentPage = category => location.pathname.split('/')[1] === category

    const [state, setState] = useState({
        checked: categories.map(item => isCurrentPage(item))
    })

    const toggleCheckbox = (e, index) => {
        setState({
            checked: Array.apply(null, Array(3)).map((item, i) => index === i ? e.target.checked : false),
        })
    }

    return (
        <nav className="Sidebar">
            <label className="Sidebar-veil" htmlFor="MenuToggler"></label>
            <div className="Sidebar-content">
                <ul className="Sidebar-menu">
                    <li className="Sidebar-menuItem">
                        <input
                            className="SubMenuToggler"
                            type="checkbox"
                            id="SubMenuToggler-1"
                            checked={state.checked[0]}
                            onChange={e => toggleCheckbox(e, 0)}
                        />
                        <label htmlFor="SubMenuToggler-1" className={ classNames('Sidebar-trigger', { 'is-active': isCurrentPage(categories[0]) }) }>
                            Getting started
                            <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                                <path d="M6,1 12,6.5 6,12" />
                            </svg>
                        </label>
                        <ul className="Sidebar-menu">
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/getting-started/" activeClassName="is-active">Introduction</Link>
                            </li>
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/getting-started/more/" activeClassName="is-active">More…</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="Sidebar-menuItem">
                        <input
                            className="SubMenuToggler"
                            type="checkbox"
                            id="SubMenuToggler-2"
                            checked={state.checked[1]}
                            onChange={e => toggleCheckbox(e, 1)}
                        />
                        <label htmlFor="SubMenuToggler-2" className={ classNames('Sidebar-trigger', { 'is-active': isCurrentPage(categories[1]) }) }>
                            Guidelines
                        <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                                <path d="M6,1 12,6.5 6,12" />
                            </svg>
                        </label>
                        <ul className="Sidebar-menu">
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/guidelines/" activeClassName="is-active">Introduction</Link>
                            </li>
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/guidelines/more/" activeClassName="is-active">More…</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="Sidebar-menuItem">
                        <input
                            className="SubMenuToggler"
                            type="checkbox"
                            id="SubMenuToggler-3"
                            checked={state.checked[2]}
                            onChange={e => toggleCheckbox(e, 2)}
                        />
                        <label htmlFor="SubMenuToggler-3" className={ classNames('Sidebar-trigger', { 'is-active': isCurrentPage(categories[2]) }) }>
                            Components
                            <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                                <path d="M6,1 12,6.5 6,12" />
                            </svg>
                        </label>
                        <ul className="Sidebar-menu">
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/components/" activeClassName="is-active">Introduction</Link>
                            </li>
                            <li className="Sidebar-menuItem">
                                <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/components/more/" activeClassName="is-active">More…</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="Sidebar-menuItem">
                        <a className="Sidebar-trigger" href="https://equinor.com">Some external link</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

Sidebar.defaultProps = {
    location: {},
}

Sidebar.propTypes = {
    location: PropTypes.object,
}

export default Sidebar
