/* eslint react/jsx-filename-extension: off  */
import { Link, graphql, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useDocs, useConfig, useCurrentDoc } from 'docz'
import { media } from '~theme/breakpoints'

const StyledSidebar = styled.nav`
  z-index: 1;
  position: fixed;
  top: 0;
  left: var(--Banner-height);
  height: 100vh;
  width: 100vw;

  display: ${(props) => (props.open ? 'block' : 'none')};
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
    /* display: none; */
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

const SubMenuLabel = styled.div`
  ${trigger}
`

const MenuArrow = styled.svg`
  width: 13px;
  height: 13px;
`

export const Sidebar = ({ className, open, onClick }) => {
  const docs = useDocs()

  const current = useCurrentDoc()

  const { menu } = useConfig()

  const firstRouteSegment = /^\/[a-z-]+\//

  const [subMenuOpen, setSubMenuOpen] = useState(
    menu.map(
      (menuItem) =>
        menuItem.route === current.route.match(firstRouteSegment)[0],
    ),
  )

  const notRootRoute = (doc) => doc.route.length > 1

  const routesWithTwoSegments = (doc) =>
    doc.route.replace(/^\/|\/$/g, '').split('/').length < 3

  const subMenus = useMemo(() =>
    docs
      .filter(notRootRoute)
      .filter(routesWithTwoSegments)
      .map((doc) => ({
        title: doc.title,
        route: doc.route,
      })),
  )

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
          {menu.map((item, index) => (
            <MenuItem key={item.route} withTopBorder>
              <SubMenuLabel
                onClick={() => {
                  setSubMenuOpen((previousState) =>
                    previousState.map((isOpen, stateIndex) =>
                      stateIndex === index ? !isOpen : false,
                    ),
                  )
                }}
              >
                {item.title}
                <MenuArrow
                  className="sidebar-menu-arrow"
                  viewBox="0 0 13 13"
                  style={
                    subMenuOpen[index] ? { transform: 'rotate(90deg)' } : {}
                  }
                >
                  <path d="M6,1 12,6.5 6,12" />
                </MenuArrow>
              </SubMenuLabel>
              <Menu
                className="sidebar-sub-menu"
                style={
                  subMenuOpen[index]
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                {subMenus
                  .filter(
                    (subMenuItem) =>
                      item.route ===
                      subMenuItem.route.match(firstRouteSegment)?.[0],
                  )
                  .map((subItem) => (
                    <MenuItem key={subItem.route} className="Sidebar-menuItem">
                      <MenuItemLink
                        type="sub"
                        className="Sidebar-trigger"
                        to={subItem.route}
                        activeClassName="is-active"
                        partiallyActive
                      >
                        {subItem.title}
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
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

Sidebar.defaultProps = {
  className: undefined,
}
