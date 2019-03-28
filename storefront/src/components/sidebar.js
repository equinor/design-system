import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Sidebar = ({ siteTitle }) => (
    <nav className="Sidebar">
        <label className="Sidebar-veil" for="MenuToggler"></label>
        <div className="Sidebar-content">
            <ul className="Sidebar-menu">
                <Link className="Sidebar-trigger" to="/">Home is where the ❤️ is</Link>
                <li className="Sidebar-menuItem">
                    <input className="SubMenuToggler" type="checkbox" id="SubMenuToggler-1" />
                    <label for="SubMenuToggler-1" className="Sidebar-trigger" href="#">
                        Getting started
                        <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                            <path d="M6,1 12,6.5 6,12" />
                        </svg>
                    </label>
                    <ul className="Sidebar-menu">
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/getting-started/">Introduction</Link>
                        </li>
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/getting-started/more/">More…</Link>
                        </li>
                    </ul>
                </li>
                <li className="Sidebar-menuItem">
                    <input className="SubMenuToggler" type="checkbox" id="SubMenuToggler-2" />
                    <label for="SubMenuToggler-2" className="Sidebar-trigger" href="#">
                        Guidelines
                    <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                            <path d="M6,1 12,6.5 6,12" />
                        </svg>
                    </label>
                    <ul className="Sidebar-menu">
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/guidelines/">Introduction</Link>
                        </li>
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/guidelines/more/">More…</Link>
                        </li>
                    </ul>
                </li>
                <li className="Sidebar-menuItem">
                    <input className="SubMenuToggler" type="checkbox" id="SubMenuToggler-3" />
                    <label for="SubMenuToggler-3" className="Sidebar-trigger" href="#">
                        Components
                        <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                            <path d="M6,1 12,6.5 6,12" />
                        </svg>
                    </label>
                    <ul className="Sidebar-menu">
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/components/">Introduction</Link>
                        </li>
                        <li className="Sidebar-menuItem">
                            <Link className="Sidebar-trigger Sidebar-trigger--indented" to="/components/more/">More…</Link>
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

export default Sidebar
