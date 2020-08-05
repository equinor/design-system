/* eslint react/jsx-filename-extension: off  */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useCurrentDoc } from 'docz'
import { Link } from 'gatsby'
import { Icon, TableOfContents, Typography } from '@equinor/eds-core-react'
import { H1 } from '../../../components/Titles'
import { Tabs, Tab, TabLink } from '../../../components/Tabs'
import { slugify } from '../../../utils/'
import {
  save,
  thumbs_down,
  info_circle,
  subdirectory_arrow_right,
  download,
} from '@equinor/eds-icons'

Icon.add({ save, thumbs_down, info_circle, subdirectory_arrow_right, download })

const { LinkItem } = TableOfContents

const ContentHeader = styled.div`
  background: #f7f7f7;
  padding: 2rem;
  display: grid;
  align-content: space-between;
  min-height: 10rem;
  @media (min-width: 600px) {
    height: 6rem;
    min-height: auto;
  }
`

const Wrapper = styled.div`
  max-width: 65rem;
`

const StyledTableOfContents = styled(TableOfContents)`
  position: static;
  margin: 3rem 2rem 0 2rem;
  box-sizing: content-box;
  @media (min-width: 1200px) {
    float: right;
    position: sticky !important;
    top: 80px !important;
    display: inline-block;
  }
`

const Content = styled.div`
  background: white;
  padding: 3rem 2rem;

  & > h2,
  & > h3,
  & > h4,
  & > h5,
  & > h6,
  & > p,
  & > ul,
  & > ol,
  & > blockquote {
    max-width: 39rem;
  }
  h2 + p,
  h3 + p,
  h4 + p,
  h5 + p,
  h6 + p,
  p:first-child {
    margin-top: 0;
  }
`
const LandingPage = styled.div``

export const MainContainer = ({ children, doc, ...rest }) => {
  const {
    tabs,
    title,
    toc,
    route,
    mode = 'draft',
    type = 'contentPage',
    slug,
  } = doc.value
  const withTabs = tabs !== undefined
  const isContentPage = type !== 'landingPage'
  const isPublished = (mode || '').toLowerCase() === 'publish'
  const current = useCurrentDoc()

  return (
    <main {...rest} id="main">
      {isContentPage ? (
        <>
          <ContentHeader withTabs={withTabs}>
            <H1>
              {title}
              {!isPublished && (
                <span className={`ModeBadge ModeBadge--${mode}`}>
                  {mode && `(${mode})`}
                </span>
              )}
            </H1>
            {tabs && (
              <nav aria-label="tabbed content naviagtion">
                <Tabs>
                  {tabs.map((tab, index) => {
                    const routeSegment = tab.toLowerCase().replace(/\s/g, '-')
                    const firstTwoRouteSegments = /^\/([a-z-]+\/?){2}/
                    const categoryRoute = route.match(firstTwoRouteSegments)[0]

                    const addTrailingSlash = (str) =>
                      str.substring(str.length - 1) === '/' ? '' : '/'

                    const tabRoute = `${categoryRoute}${addTrailingSlash(
                      categoryRoute,
                    )}${index > 0 ? `${routeSegment}/` : ''}`

                    return (
                      <Tab key={tab}>
                        <TabLink
                          isSelected={current.route === tabRoute}
                          href={tabRoute}
                        >
                          {tab}
                        </TabLink>
                      </Tab>
                    )
                  })}
                </Tabs>
              </nav>
            )}
          </ContentHeader>
          <Wrapper>
            {toc && (
              <StyledTableOfContents sticky label="Content">
                {toc.map((item) => {
                  return (
                    <LinkItem key={item}>
                      <Typography
                        variant="body_short"
                        link
                        href={`#${slugify(item)}`}
                      >
                        <Icon name="subdirectory_arrow_right" size={16} />
                        <span>{item}</span>
                      </Typography>
                    </LinkItem>
                  )
                })}
              </StyledTableOfContents>
            )}
            <Content>
              {children}
              <a
                href={`https://github.com/equinor/design-system/tree/documentation/apps/storefront/src/content/${
                  slug === '/' ? `index` : slug
                }.mdx`}
                style={{ display: 'block', marginTop: '3rem' }}
              >
                <span role="img" aria-label="Pencil">
                  ✏️
                </span>{' '}
                Edit this page on GitHub
              </a>
            </Content>
          </Wrapper>
        </>
      ) : (
        <LandingPage>{children}</LandingPage>
      )}
    </main>
  )
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  doc: PropTypes.object.isRequired,
}
