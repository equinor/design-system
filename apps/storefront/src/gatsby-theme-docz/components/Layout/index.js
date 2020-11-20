/* eslint react/jsx-filename-extension: off  */
/* eslint react/jsx-pascal-case: off  */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { MainContainer } from '../MainContainer'
import { SkipLink } from '../../../components/SkipLink'
import { BaseLayout } from '../../../components/BaseLayout'
import SEO from '../../base/seo'
import styled from 'styled-components'
import './global.css'

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
  const [open, setOpen] = useState(false)

  return (
    <BaseLayout>
      <SEO title={doc.value.metaTitle} />
      {/* <Global styles={global} /> */}
      {/*  <Main sx={styles.main}> */}
      <SkipLink />
      <StyledHeader onOpen={() => setOpen((s) => !s)} />
      <StyledSidebar
        open={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(false)}
      />
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
