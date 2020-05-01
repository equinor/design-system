import React from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { MDXProvider } from '@mdx-js/react'
import { TopBar, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import './layout.css'
// MDX components
import ComponentStatus from './ComponentStatus'
import Embed from './embed'
import Video from './video'
import FigmaImage from './figmaImage'
import IconsDownload from './Icons'
import Image from './image'

const mdxComponents = {
  ComponentStatus,
  Embed,
  Video,
  FigmaImage,
  IconsDownload,
  Image,
}

const { Header: TopBarHeader, Actions } = TopBar

const ContentHeader = styled.div`
  background: #f7f7f7;
  padding: 2rem;
  height: 10rem;
  display: grid;
  align-content: end;

  & > h1 {
    margin: 0;
  }
`

const Content = styled.div`
  background: white;
  padding: 2rem;
  & > h2,
  & > h3,
  & > h4,
  & > h5,
  & > h6,
  & > p,
  & > ul,
  & > ol {
    max-width: 38rem;
  }
`

const Layout = ({ children }) => {
  const childrenArr = React.Children.toArray(children)

  return (
    <MDXProvider components={mdxComponents}>
      <div className="Page">
        <TopBar style={{ gridArea: 'header' }}>
          <TopBarHeader>
            <label className="Burger" htmlFor="MenuToggler" />
            EDS – Equinor Design System
          </TopBarHeader>
          <Actions>
            <Typography
              href="/components/component-status"
              variant="body_short"
              link
            >
              Component Status
            </Typography>
          </Actions>
        </TopBar>
        {/* <Banner /> */}
        <input id="MenuToggler" className="MenuToggler" type="checkbox" />
        {/* <Header /> */}
        <Location>{({ location }) => <Sidebar location={location} />}</Location>
        {/* <nav className="TOC">TOC</nav> */}
        <main style={{ gridArea: 'main' }}>
          <ContentHeader>{childrenArr.shift()}</ContentHeader>
          <Content>{childrenArr}</Content>
        </main>
      </div>
    </MDXProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
