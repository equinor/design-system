/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import PropTypes from 'prop-types'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql, Link } from 'gatsby'
import classNames from 'classnames'
import { Icon, TableOfContents, Typography } from '@equinor/eds-core-react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { H1 } from '../components/Titles'

import {
  save,
  thumbs_down,
  info_circle,
  subdirectory_arrow_right,
  download,
} from '@equinor/eds-icons'
import { slugify } from '../utils/'
import styled from 'styled-components'

Icon.add({ save, thumbs_down, info_circle, subdirectory_arrow_right, download })

const { LinkItem } = TableOfContents

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

const Wrapper = styled.div`
  max-width: 65rem;
`

const ContentHeader = styled.div`
  background: #f7f7f7;
  padding: ${({ withTabs }) => (withTabs ? '2rem 2rem 0 2rem' : '2rem')};
  display: grid;
  align-content: space-between
  min-height: 10rem;
  @media (min-width: 600px) {
    height: 10rem;
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

const Page = ({ data }) => {
  const page = data.mdx
  const {
    tabs,
    title,
    toc,
    mode = 'draft',
    type = 'contentPage',
  } = page.frontmatter
  const { slug } = page.fields
  const { currentPage } = page.fields
  const linkSlug = slug.substr(0, slug.lastIndexOf(currentPage))
  const withTabs = tabs !== null
  const isPublished = (mode || '').toLowerCase() === 'publish'
  const isContentPage = type !== 'landingPage'
  console.log('stage', process.env.GATSBY_STAGE)
  return (
    <Layout>
      <SEO title={title} />
      {isContentPage ? (
        <>
          <ContentHeader>
            <H1>
              {title}
              {!isPublished && (
                <span className={`ModeBadge ModeBadge--${mode}`}>
                  {mode && `(${mode})`}
                </span>
              )}
            </H1>

            {withTabs && (
              <nav aria-label="tabbed content naviagtion">
                <ul className="Tabs">
                  {tabs.map((tab, index) => (
                    <li className="Tab" key={tab}>
                      <Link
                        to={
                          index > 0
                            ? `${linkSlug}${tab
                                .toLowerCase()
                                .split(' ')
                                .join('-')}/`
                            : linkSlug
                        }
                        className={classNames('Tab-link', {
                          'is-selected':
                            tab.toLowerCase().split(' ').join('-') ===
                            currentPage,
                        })}
                      >
                        {tab}
                      </Link>
                    </li>
                  ))}
                </ul>
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
              {/*  <dl className="DebugDefList">
          <dt>Current category</dt>
          <dd>{currentCategory}</dd>
          <dt>Current page</dt>
          <dd>{currentPage}</dd>
          <dt>Slug</dt>
          <dd>{slug}</dd>
          <dt>linkSlug</dt>
          <dd>{linkSlug}</dd>
        </dl> */}

              {(process.env.GATSBY_STAGE === 'dev' || isPublished) && (
                <MDXRenderer>{page.body}</MDXRenderer>
              )}

              <p style={{ marginTop: '3rem' }}>
                <a
                  href={`https://github.com/equinor/design-system/tree/documentation/apps/storefront/src/content${
                    slug === '/' ? `index` : slug
                  }.mdx`}
                >
                  <span role="img" aria-label="Pencil">
                    ✏️
                  </span>{' '}
                  Edit this page on GitHub
                </a>
              </p>
            </Content>
          </Wrapper>
        </>
      ) : (
        <LandingPage>
          {(process.env.GATSBY_STAGE === 'dev' || isPublished) && (
            <MDXRenderer>{page.body}</MDXRenderer>
          )}
        </LandingPage>
      )}
    </Layout>
  )
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Page // eslint-disable-line

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      fields {
        slug
        currentPage
        currentCategory
      }
      frontmatter {
        title
        tabs
        mode
        toc
        type
      }
    }
  }
`
