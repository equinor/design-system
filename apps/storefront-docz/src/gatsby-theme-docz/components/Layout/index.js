/* eslint react/jsx-filename-extension: off  */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { MainContainer } from '../MainContainer'
import { SkipLink } from '../../../components/SkipLink'
import { BaseLayout } from '../../../components/BaseLayout'
import { NavDrawer } from '../../../components/NavDrawer'
import styled from 'styled-components'
import './layout.css'

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
    <BaseLayout>
      {/* <Global styles={global} /> */}
      {/*  <Main sx={styles.main}> */}
      <SkipLink />
      <StyledHeader onOpen={() => setOpen((s) => !s)} />
      <Location>
        {({ location }) => (
          <NavDrawer />
          // <StyledSidebar
          //   open={open}
          //   onFocus={() => setOpen(true)}
          //   onBlur={() => setOpen(false)}
          //   onClick={() => setOpen(false)}
          //   location={location}
          // />
        )}
      </Location>
      <StyledMainContainer data-testid="main-container" doc={doc}>
        {children}
      </StyledMainContainer>

      {/*   </Main> */}
    </BaseLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  doc: PropTypes.object.isRequired,
}
