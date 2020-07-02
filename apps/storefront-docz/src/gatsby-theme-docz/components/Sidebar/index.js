/* eslint react/jsx-filename-extension: off  */
import { Link, graphql, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { kebabify } from '../../../utils'
import styled, { css } from 'styled-components'
import { media } from '~theme/breakpoints'

const StyledSidebar = styled.nav`
  z-index: 1;
  position: fixed;
  top: 0;
  left: var(--Banner-height);
  height: 100vh;
  width: 100vw;

  display: ${(props) => (props.open ? 'block' : 'none')};
    }
  ${media.large} {
    display: block;
    position: relative;
    width: auto;
  }
`
const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: var(--Banner-height);
  width: 100vw;
  height: 100vh;
  transition: 'all .2s ease-out';
  ${media.large} {
    display: none;
  }
`

const Content = styled.div`
  background-color: var(--Sidebar-backgroundColor);
  border-right: 1px solid var(--borderColor);
  box-shadow: 0 0 30px 0 var(--Sidebar-shadowColor);
  z-index: 1;

  position: fixed;
  top: var(--Banner-height);
  left: 0;

  width: var(--Sidebar-width);
  height: 100vh;

  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  ${media.large} {
    box-shadow: none;
  }
`
const Menu = styled.ul`
  margin-top: 0;
  list-style-type: none;
  padding-left: 0;
  &.sidebar-sub-menu {
    display: none;
  }
`

const MenuItem = styled.li`
  border-top: ${(props) =>
    props.withTopBorder ? `1px solid var(--borderColor)` : 'none'};
`

const trigger = css`
  padding: 0.85rem 1rem 0.85rem 2rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MenuItemLink = styled(Link)`
  ${trigger}
  ${({ type }) =>
    type === 'sub' &&
    `
    font-size: 0.8125em;
      padding-top: 0.65rem;
      padding-bottom: 0.65rem;
  `}
  &.is-active {
    background-color: var(--Sidebar-activeLink-backgroundColor);
  }
`

const SubMenuToggler = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  visibility: hidden;
  &:checked ~ {
    .sidebar-sub-menu {
      display: block;
    }
    .sidebar-menu-arrow {
      transform: rotate(90deg);
    }
  }
`

const SubMenuLabel = styled.label`
  ${trigger}
`

const MenuArrow = styled.svg`
  width: 13px;
  height: 13px;
`

export const Sidebar = ({ location, className, open, onClick }) => {
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
    <StyledSidebar className={className} open={open}>
      <Overlay onClick={onClick} />
      <Content>
        <Menu>
          <MenuItem>
            <MenuItemLink to="/" className="Sidebar-trigger">
              Home
            </MenuItemLink>
          </MenuItem>
          {data.allNavigationYaml.edges.map((item, index) => (
            <MenuItem key={kebabify(item.node.title)} withTopBorder>
              <SubMenuToggler
                className="SubMenuToggler"
                type="checkbox"
                id={`SubMenuToggler-${index}`}
                checked={state.checked[index]}
                onChange={(e) => toggleCheckbox(e, index)}
              />
              <SubMenuLabel htmlFor={`SubMenuToggler-${index}`}>
                {item.node.title}
                <MenuArrow className="sidebar-menu-arrow" viewBox="0 0 13 13">
                  <path d="M6,1 12,6.5 6,12" />
                </MenuArrow>
              </SubMenuLabel>
              <Menu className="sidebar-sub-menu">
                {item.node.subNav &&
                  item.node.subNav.map((subItem) => (
                    <MenuItem
                      key={kebabify(subItem)}
                      className="Sidebar-menuItem"
                    >
                      <MenuItemLink
                        type="sub"
                        className="Sidebar-trigger"
                        to={`/${kebabify(item.node.title)}/${kebabify(
                          subItem,
                        )}/`}
                        activeClassName="is-active"
                        partiallyActive
                      >
                        {subItem}
                      </MenuItemLink>
                    </MenuItem>
                  ))}
              </Menu>
            </MenuItem>
          ))}
        </Menu>
      </Content>
    </StyledSidebar>
  )
}

Sidebar.propTypes = {
  location: PropTypes.object.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

Sidebar.defaultProps = {
  className: undefined,
}
