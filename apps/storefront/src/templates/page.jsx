/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import PropTypes from 'prop-types'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql, Link } from 'gatsby'
import classNames from 'classnames'
import {
  Tabs,
  Icon,
  TableOfContents,
  Typography,
} from '@equinor/eds-core-react'
import Layout from '../components/layout'
import SEO from '../components/seo'

import {
  save,
  thumbs_down,
  info_circle,
  subdirectory_arrow_right,
} from '@equinor/eds-icons'
import { slugify } from '../utils/'
import styled from 'styled-components'

Icon.add({ save, thumbs_down, info_circle, subdirectory_arrow_right })

const { TabList, Tab, TabPanels, TabPanel } = Tabs
const { LinkItem } = TableOfContents

const StyledTableOfContents = styled(TableOfContents)`
  position: static;
  margin: 32px 0;
  @media (min-width: 1200px) {
    float: right;
    position: sticky;
    top: 80px;
    display: inline-block;
    margin-top: -64px;
  }
`

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
  max-width: 65rem;
  & > h2,
  & > h3,
  & > h4,
  & > h5,
  & > h6,
  & > p,
  & > ul,
  & > ol {
    max-width: 39rem;
  }
  h2 + p,
  h3 + p,
  h4 + p,
  h5 + p,
  h6 + p {
    margin-top: 0;
  }
`

const Page = ({ data }) => {
  const page = data.mdx
  const { tabs, title, toc, mode = 'draft' } = page.frontmatter
  const { slug } = page.fields
  const { currentPage } = page.fields
  const { currentCategory } = page.fields
  const linkSlug = slug.substr(0, slug.lastIndexOf(currentPage))

  const isPublished = (mode || '').toLowerCase() === 'publish'
  return (
    <Layout>
      <SEO title={title} />
      <ContentHeader>
        <h1>
          {title}
          {!isPublished && (
            <span className={`ModeBadge ModeBadge--${mode}`}>
              {mode && `(${mode})`}
            </span>
          )}
        </h1>
      </ContentHeader>
      <Content>
        {!(tabs === null) && (
          <ul className="Tabs">
            {tabs.map((tab, index) => (
              <li className="Tab" key={tab}>
                <Link
                  to={
                    index > 0
                      ? `${linkSlug}${tab.toLowerCase().split(' ').join('-')}/`
                      : linkSlug
                  }
                  className={classNames('Tab-link', {
                    'is-selected':
                      tab.toLowerCase().split(' ').join('-') === currentPage,
                  })}
                >
                  {tab}
                </Link>
              </li>
            ))}
          </ul>
        )}
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
        <dl className="DebugDefList">
          <dt>Current category</dt>
          <dd>{currentCategory}</dd>
          <dt>Current page</dt>
          <dd>{currentPage}</dd>
          <dt>Slug</dt>
          <dd>{slug}</dd>
          <dt>linkSlug</dt>
          <dd>{linkSlug}</dd>
        </dl>

        {(process.env.GATSBY_STAGE === 'dev' || isPublished) && (
          <MDXRenderer>{page.body}</MDXRenderer>
        )}

        <p style={{ marginTop: '3rem' }}>
          <a
            href={`https://github.com/equinor/design-system/tree/documentation/apps/storefront/src/content/${
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
    </Layout>
  )
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Page

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
      }
    }
  }
`
