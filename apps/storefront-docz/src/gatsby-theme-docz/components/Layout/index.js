/* eslint react/jsx-filename-extension: off  */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { media } from '~theme/breakpoints'
import { MainContainer } from '../MainContainer'
import styled from 'styled-components'
import './layout.css'

const BaseLayout = styled.div`
  display: grid;
  grid-template-areas:
    'header'
    'main'
    'main';
  grid-template-columns: 1fr;
  grid-template-rows: var(--Banner-height) var(--Header-height) 1fr;
  min-height: 100vh;
  ${media.small} {
    grid-template-areas:
      'header header'
      'main main';
    grid-template-columns: 1fr min-content;
    grid-template-rows: var(--Banner-height) var(--Header-height) 1fr;
  }
  ${media.large} {
    grid-template-areas:
      'header header header'
      'sidebar main main'
      'sidebar main main';
    grid-template-columns: var(--Sidebar-width) 1fr var(--Toc-width);
    grid-template-rows: var(--Banner-height) var(--Header-height) 1fr;
  }
`

const SkipLink = styled.a`
  background: #007079;
  color: #fff;
  font-weight: 700;
  left: 50%;
  padding: 8px;
  position: absolute;
  transform: translateY(-100%);
  z-index: 1010 !important;
  &:focus {
    outline: none;
    outline: 1px dashed rgba(0, 112, 121, 1);
    outline-offset: 2px;
    border-radius: 4px;
    transform: translateY(0%);
  }
`

const StyledMainContainer = styled(MainContainer)`
  grid-area: main;
`
const StyledHeader = styled(Header)`
  grid-area: header;
`
const StyledSidebar = styled(Sidebar)`
  grid-area: sidebar;
`

export const Layout = ({ doc, children }) => {
  console.log('doc', doc)
  const [open, setOpen] = useState(false)
  return (
    <BaseLayout data-testid="layout">
      {/* <Global styles={global} /> */}
      {/*  <Main sx={styles.main}> */}
      <SkipLink className="skip-link" href="#main">
        Skip to content
      </SkipLink>
      <StyledHeader onOpen={() => setOpen((s) => !s)} />
      <Location>
        {({ location }) => (
          <StyledSidebar
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
            location={location}
          />
        )}
      </Location>

      <StyledMainContainer data-testid="main-container">
        {children}
      </StyledMainContainer>

      {/*   </Main> */}
    </BaseLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
