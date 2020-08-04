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
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  )
}

const themeConfig = merge(defaultConfig, {
  colors: {
    modes: {
      light: {
        grayLighter: '#d0d0d0',
        gray2: '#aaa',
        background2: '#fff',
        info: 'rgb(56, 132, 255)',
        success: 'rgb(0, 204, 136)',
        warning: 'rgb(255, 204, 0)',
        danger: 'rgb(243, 32, 19)',
        default: 'rgb(0, 0, 0, .3)',
        infoLight: 'rgba(56, 132, 255, .1)',
        successLight: 'rgba(0, 219, 136, .1)',
        warningLight: 'rgba(255, 204, 0, .1)',
        dangerLight: 'rgba(243, 32, 19, .1)',
        defaultLight: 'rgba(0, 0, 0, .04)',
        backdrop: 'rgba(0, 0, 0, .15)',
        mossGreen: '#007079',
        text: '#333',
      },
      dark: {
        grayLighter: '#bbb',
        gray2: '#aaa',
        background2: 'rgba(0,0,0,.1)',
        info: 'rgb(56, 132, 255)',
        success: 'rgb(0, 204, 136)',
        warning: 'rgb(255, 204, 0)',
        danger: 'rgb(243, 32, 19)',
        default: 'rgb(255, 255, 255, .6)',
        infoLight: 'rgba(56, 132, 255, .1)',
        successLight: 'rgba(0, 219, 136, .1)',
        warningLight: 'rgba(255, 204, 0, .1)',
        dangerLight: 'rgba(243, 32, 19, .1)',
        defaultLight: 'rgba(255, 255, 255, .3)',
        backdrop: 'rgba(255, 255, 255, .15)',
      },
    },
  },
  boxShadow: '0 3px 7px 0 rgba(105, 111, 132, 0.1)',
  styles: {
    root: {
      fontFamily: `'Equinor', 'Roboto', sans-serif`,
      fontSize: '16px',
      fontKerning: 'normal',
      fontFeatureSettings: `kern, liga`,
      color: 'text',
      bg: 'background',
      height: '100%',
      margin: '0',
    },
    body: {
      margin: '0',
      overflowY: 'scroll',
    },
    h1: {
      fontFamily: 'inherit',
    },
    h2: {
      fontFamily: 'inherit',
    },
    h3: {
      fontFamily: 'inherit',
    },
    code: {
      fontFamily: 'Consolas, monaco, monospace',
    },
    inlineCode: {
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'Consolas, monaco, monospace',
      backgroundColor: defaultConfig.colors.blockquote.bg,
      color: defaultConfig.colors.grayDark,
      fontSize: '0.85em',
      letterSpacing: '-0.3px',
      padding: '3px 8px',
      borderRadius: '3px',
    },
    table: {
      width: '100%',
      my: 4,
      borderCollapse: 'collapse',
      borderSpacing: 0,
      [['th', 'td']]: {
        textAlign: 'left',
        py: '12px',
        pr: '12px',
        pl: '12px',
        borderColor: 'border',
        borderBottomStyle: 'solid',
      },
    },
    th: {
      verticalAlign: 'middle',
      borderBottomWidth: '1px',
    },
    td: {
      verticalAlign: 'middle',
      borderBottomWidth: '1px',
    },
    hr: {
      margin: '3rem 0 !important',
    },
  },
})

export default theme(themeConfig)(Theme)
