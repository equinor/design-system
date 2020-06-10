import React from 'react'
import PropTypes from 'prop-types'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql, Link } from 'gatsby'
import classNames from 'classnames'
import { Tabs, Icon } from '@equinor/eds-core-react'
import Layout from '../components/layout'

import { save, thumbs_down } from '@equinor/eds-icons'
Icon.add({ save, thumbs_down })

const { TabList, Tab, TabPanels, TabPanel } = Tabs

const Page = ({ data }) => {
  const page = data.mdx
  const { tabs, title, mode = 'draft' } = page.frontmatter
  const { slug } = page.fields
  const { currentPage } = page.fields
  const { currentCategory } = page.fields
  const linkSlug = slug.substr(0, slug.lastIndexOf(currentPage))

  const isPublished = (mode || '').toLowerCase() === 'publish'

  return (
    <Layout>
      <h1>
        {title}
        {!isPublished && (
          <span className={`ModeBadge ModeBadge--${mode}`}>
            {mode && `(${mode})`}
          </span>
        )}
      </h1>
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
          </span>
          Edit this page on GitHub
        </a>
      </p>
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
      }
    }
  }
`
