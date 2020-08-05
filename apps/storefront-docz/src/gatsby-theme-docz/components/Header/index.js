/* eslint react/jsx-filename-extension: off  */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { menu } from '@equinor/eds-icons'
/* eslint-disable-next-line */
import { TopBar, Search, Icon } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { media } from '~theme/breakpoints'
import { useThemeUI } from 'theme-ui'

Icon.add({ menu })
const { Header: TopBarHeader, Actions } = TopBar

const StyledActions = styled(Actions)`
  display: flex;
  align-items: center;
`

const Burger = styled.button`
  height: 48px;
  width: 48px;
  background: transparent;
  border: none;
  cursor: pointer;
  ${media.large} {
    display: none;
  }
`

const SrLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

export const Header = ({ className, onOpen }) => {
  const context = useThemeUI()
  const { theme } = context
  return (
    <TopBar className={className}>
      <TopBarHeader>
        <Burger onClick={onOpen} aria-label="Open menu">
          <Icon name="menu" />
        </Burger>
        EDS – Equinor Design System
      </TopBarHeader>
      <StyledActions>
        {/*  <Search
            aria-label="sitewide search"
            id="search"
            placeholder="Search"
          /> */}
        <label htmlFor="search">
          <SrLabel>Sitewide search</SrLabel>
          <input type="search" id="search" placeholder="search" />
        </label>

        <Link
          to="/components/component-status"
          style={{
            color: theme.colors.primary,
            flexShrink: '0',
            marginLeft: '1rem',
          }}
        >
          Component Status
        </Link>
      </StyledActions>
    </TopBar>
  )
}

Header.propTypes = {
  className: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
}

Header.defaultProps = {
  className: null,
}
