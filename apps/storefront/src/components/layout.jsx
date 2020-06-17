import React from 'react'
import PropTypes from 'prop-types'
import { Location, Link } from '@reach/router'
import { MDXProvider } from '@mdx-js/react'
import { TopBar, Table } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import Sidebar from './Sidebar'
import './layout.css'

// MDX components
import ComponentStatus from './ComponentStatus'
import Embed from './embed'
import Video from './video'
import FigmaImage from './figmaImage'
import IconsDownload from './Icons'
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

const Layout = ({ children }) => {
  const childrenArr = React.Children.toArray(children)

  return (
    <MDXProvider components={mdxComponents}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://eds-static.equinor.com/font/equinor-font.css"
        />
      </Helmet>
      <div className="Page">
        <TopBar style={{ gridArea: 'header' }}>
          <TopBarHeader>
            <label className="Burger" htmlFor="MenuToggler" />
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
        <input id="MenuToggler" className="MenuToggler" type="checkbox" />
        {/* <Header /> */}
        <Location>{({ location }) => <Sidebar location={location} />}</Location>

        <main style={{ gridArea: 'main' }}>{children}</main>
      </div>
    </MDXProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
