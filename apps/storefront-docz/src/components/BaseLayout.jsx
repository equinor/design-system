import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { media } from '../gatsby-theme-docz/theme/breakpoints'

const StyledBaseLayout = styled.div`
  display: grid;
  grid-template-areas:
    'header'
    'main'
    'main';
  grid-template-columns: 1fr;
  grid-template-rows: var(---heightBanner) var(--Header-height) 1fr;
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

export const BaseLayout = ({ children }) => {
  return <StyledBaseLayout>{children}</StyledBaseLayout>
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
