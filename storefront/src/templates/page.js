import React, { useLayoutEffect } from 'react'
import Layout from '../components/layout'
import { MDXRenderer } from 'gatsby-mdx'
import { graphql, Link } from 'gatsby'
import classNames from 'classnames'

export default ({ data }) => {

  const page = data.mdx
  const tabs = page.frontmatter.tabs
  const slug = page.fields.slug
  const currentPage = page.fields.currentPage
  const currentCategory = page.fields.currentCategory
  const linkSlug = slug.substr(0, slug.lastIndexOf(currentPage))

  console.log('linkSlug:', linkSlug)


  return (
    <Layout>
      <h1>
        { page.frontmatter.title }
        {
          page.frontmatter.mode !== 'publish' &&
          <span className={ `ModeBadge ModeBadge--${ page.frontmatter.mode }` }>
            { page.frontmatter.mode && `(${ page.frontmatter.mode })` }
          </span>
        }

      </h1>
      {
        !(page.frontmatter.tabs === null) && (
          <ul className="Tabs">
            {
              tabs.map( (tab, index) =>
                <li className="Tab" key={ tab }>
                  <Link
                    to={ index > 0 ? `${linkSlug}${ tab.toLowerCase().split(' ').join('-')}/` : linkSlug }
                    className={
                      classNames( 'Tab-link', {
                        'is-selected': tab.toLowerCase().split(' ').join('-') === currentPage
                      })
                    }>
                    { tab }
                  </Link>
                </li>
              )
            }
          </ul>
        )
      }
      <dl className="DebugDefList">
        <dt>Current category</dt>
        <dd>{ currentCategory }</dd>
        <dt>Current page</dt>
        <dd>{ currentPage }</dd>
        <dt>Slug</dt>
        <dd>{ slug }</dd>
        <dt>linkSlug</dt>
        <dd>{ linkSlug }</dd>
      </dl>
      {
        (process.env.GATSBY_STAGE === 'dev' || page.frontmatter.mode === 'publish') && <MDXRenderer>{ page.code.body }</MDXRenderer>
      }
    </Layout>
  )
}

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
