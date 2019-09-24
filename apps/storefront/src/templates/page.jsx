import React from 'react'
import PropTypes from 'prop-types'
import { MDXRenderer } from 'gatsby-mdx'
import { graphql, Link } from 'gatsby'
import classNames from 'classnames'
import Layout from '../components/layout'

const Page = ({ data }) => {
  const page = data.mdx
  const { tabs } = page.frontmatter
  const { slug } = page.fields
  const { currentPage } = page.fields
  const { currentCategory } = page.fields
  const linkSlug = slug.substr(0, slug.lastIndexOf(currentPage))

  return (
    <Layout>
      <h1>
        {page.frontmatter.title}
        {page.frontmatter.mode !== 'publish' && (
          <span className={`ModeBadge ModeBadge--${page.frontmatter.mode}`}>
            {page.frontmatter.mode && `(${page.frontmatter.mode})`}
          </span>
        )}
      </h1>
      {!(page.frontmatter.tabs === null) && (
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
                    tab
                      .toLowerCase()
                      .split(' ')
                      .join('-') === currentPage,
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
      {(process.env.GATSBY_STAGE === 'dev' ||
        page.frontmatter.mode === 'publish') && (
        <MDXRenderer>{page.code.body}</MDXRenderer>
      )}
      <p style={{ marginTop: '3rem' }}>
        <a
          href={`https://github.com/equinor/design-system/tree/develop/apps/storefront/src/content/${
            slug === '/' ? `index` : slug
          }.mdx`}
        >
          <span role="img" aria-label="Pencil">
            ✏️
          </span>{' '}
          Edit this page on GitHub
        </a>
      </p>
    </Layout>
  )
}

Page.propTypes = {
  data: PropTypes.node.isRequired,
}

export default Page

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      code {
        body
      }
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
