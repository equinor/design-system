/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link, graphql, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classNames from 'classnames'
import { kebabify } from '../../utils'
import './Sidebar.css'

const Sidebar = ({ location }) => {
  const data = useStaticQuery(graphql`
    query SidebarQuery {
      allNavigationYaml {
        edges {
          node {
            title
            subNav
          }
        }
      }
    }
  `)

  const categories = data.allNavigationYaml.edges.map((item) =>
    kebabify(item.node.title),
  )

  const isCurrentCategory = (category) =>
    location.pathname.split('/').filter((item) => item.length > 0)[0] ===
    category

  const [state, setState] = useState({
    checked: categories.map((item) => isCurrentCategory(item)),
  })

  const toggleCheckbox = (event, index) => {
    setState({
      checked: categories.map((item, i) =>
        index === i ? event.target.checked : false,
      ),
    })
  }

  return (
    <nav className="Sidebar">
      <label className="Sidebar-veil" htmlFor="MenuToggler" />
      <div className="Sidebar-content">
        <ul className="Sidebar-menu">
          <li className="Sidebar-menuItem">
            <Link to="/" className="Sidebar-trigger">
              Home
            </Link>
          </li>
          {data.allNavigationYaml.edges.map((item, index) => (
            <li
              key={kebabify(item.node.title)}
              className={classNames(
                'Sidebar-menuItem',
                'Sidebar-menuItem--borderTop',
              )}
            >
              <input
                className="SubMenuToggler"
                type="checkbox"
                id={`SubMenuToggler-${index}`}
                checked={state.checked[index]}
                onChange={(e) => toggleCheckbox(e, index)}
              />
              <label
                className="Sidebar-trigger"
                htmlFor={`SubMenuToggler-${index}`}
              >
                {item.node.title}
                <svg className="Sidebar-menuArrow" viewBox="0 0 13 13">
                  <path d="M6,1 12,6.5 6,12" />
                </svg>
              </label>
              <ul className="Sidebar-menu">
                {item.node.subNav &&
                  item.node.subNav.map((subItem) => (
                    <li key={kebabify(subItem)} className="Sidebar-menuItem">
                      <Link
                        className="Sidebar-trigger Sidebar-trigger--small"
                        to={`/${kebabify(item.node.title)}/${kebabify(
                          subItem,
                        )}/`}
                        activeClassName="is-active"
                        partiallyActive
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

Sidebar.propTypes = {
  location: PropTypes.object.isRequired,
}

export default Sidebar // eslint-disable-line
