import React from 'react'
import PropTypes from 'prop-types'
import { Location, Link } from '@reach/router'
import { MDXProvider } from '@mdx-js/react'
import { TopBar, Table } from '@equinor/eds-core-react'
import { Helmet } from 'react-helmet'
import Sidebar from './Sidebar'
import './layout.css'
import styled from 'styled-components'

// MDX components
import ComponentStatus from './ComponentStatus'
import Embed from './embed'
import Video from './video'
import FigmaImage from './figmaImage'
import IconsDownload from './Icons'
import HeroBanner from './HeroBanner'
import Image from './image'
import Text from './Text'
import { H1, H2, H3, H4 } from './Titles'
import { OrderedList, UnorderedList, ListItem } from './List'
import HeadCell from './HeadCell'
import Grid from './Grid'
import Code from './Code'

const { Body, Row, Cell, Head } = Table

const mdxComponents = {
  ComponentStatus,
  Embed,
  Video,
  FigmaImage,
  IconsDownload,
  Image,
  Grid,
  HeroBanner,
  p: Text,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  table: Table,
  thead: Head,
  tr: Row,
  td: Cell,
  th: HeadCell,
  tbody: Body,
  inlineCode: Code,
}

const { Header: TopBarHeader, Actions } = TopBar

const SkipLink = styled.a`
  background: #007079;
  color: #fff;
  font-weight: 700;
  left: 50%;
  padding: 8px;
  position: absolute;
  transform: translateY(-100%);
  z-index: 1010;
  &:focus {
    outline: none;
    outline: 1px dashed rgba(0, 112, 121, 1);
    outline-offset: 2px;
    border-radius: 4px;
    transform: translateY(0%);
  }
`

const Layout = ({ children }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://eds-static.equinor.com/font/equinor-font.css"
        />
      </Helmet>
      <div className="Page">
        <SkipLink className="skip-link" href="#main">
          Skip to content
        </SkipLink>
        <TopBar style={{ gridArea: 'header' }}>
          <TopBarHeader>
            {/* Can't manage to use either assert for this rule, even if I copy paste from example */}
            {/* eslint-disable-next-line */}
            <label className="Burger" htmlFor="MenuToggler"></label>
            EDS – Equinor Design System
          </TopBarHeader>
          <Actions>
            <Link
              to="/components/component-status"
              style={{ color: 'var(--moss-green)' }}
            >
              Component Status
            </Link>
          </Actions>
        </TopBar>
        {/* <Banner /> */}
        {/* Can't manage to use either assert for this rule, even if I copy paste from example */}
        {/* eslint-disable-next-line */}
        <input id="MenuToggler" className="MenuToggler" type="checkbox" />
        {/* <Header /> */}
        <Location>{({ location }) => <Sidebar location={location} />}</Location>

        <main id="main" style={{ gridArea: 'main' }}>
          {children}
        </main>
      </div>
    </MDXProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout // eslint-disable-line
