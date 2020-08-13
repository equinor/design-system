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
import { DocSearch } from '../../../components/DocSearch'

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

export const Header = ({ className, onOpen }) => {
  const context = useThemeUI()
  const { theme } = context
  return (
    <TopBar className={className}>
      <TopBarHeader>
        <Burger onClick={onOpen} aria-label="Open menu">
          <Icon name="menu" />
        </Burger>
        <Link
          to="/"
          style={{
            color: theme.colors.text,
            textDecoration: 'none',
          }}
        >
          EDS – Equinor Design System
        </Link>
      </TopBarHeader>
      <StyledActions>
        <DocSearch />
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
