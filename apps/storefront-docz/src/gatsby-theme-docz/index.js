/* eslint react/jsx-filename-extension: off */
/* eslint react/jsx-pascal-case: off */
/* eslint import/no-default-export: off */
import React from 'react'
import { ComponentsProvider, theme, useConfig } from 'docz'
import baseComponents from 'gatsby-theme-docz/src/components'
import defaultConfig from 'gatsby-theme-docz/src/theme'
import { Table } from '@equinor/eds-core-react'
import { merge } from 'lodash/fp'
import { Styled, ThemeProvider } from 'theme-ui'
import Embed from '../components/embed'
import ComponentStatus from '../components/ComponentStatus'
import Video from '../components/video'
import FigmaImage from '../components/figmaImage'
import IconsDownload from '../components/Icons'
import HeroBanner from '../components/HeroBanner'
import Image from '../components/image'
import Text from '../components/Text'
import { H1, H2, H3, H4 } from '../components/Titles'
import { OrderedList, UnorderedList, ListItem } from '../components/List'
import HeadCell from '../components/HeadCell'
import Grid from '../components/Grid'
import Code from '../components/Code'

const { Body, Row, Cell, Head } = Table

const componentsMap = {
  ...baseComponents,
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

// eslint-disable-next-line react/prop-types
const Theme = ({ children }) => {
  const config = useConfig()
  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={componentsMap}>
        {console.log('componentsMap:', componentsMap)}
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  )
}

const themeConfig = merge(defaultConfig, {
  colors: {
    paleGreen: '#deedee',
    modes: {
      light: {
        grayLighter: '#d0d0d0',
        primary: '#007079',
        text: '#333',
        background: 'white',
        borderColor: 'lightgrey',
      },
    },
  },
  fonts: {
    body: `'Equinor', 'Roboto', sans-serif`,
    heading: `'Equinor', 'Roboto', sans-serif`,
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontSize: '16px',
      fontKerning: 'normal',
      fontFeatureSettings: `kern, liga`,
      height: '100%',
      margin: 0,
      overflowY: 'scroll',
    },
    a: {
      textDecoration: 'underline',
    },
  },
})

export default theme(themeConfig)(Theme)
