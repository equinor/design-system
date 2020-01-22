import { Link, useStaticQuery, graphql } from 'gatsby'
import React from 'react'

export const Header = () => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="Header">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
      <label className="Burger" htmlFor="MenuToggler" />
      <h1 className="Header-title">
        <Link to="/" className="Header-link">
          {data.site.siteMetadata.title}
        </Link>
      </h1>
    </div>
  )
}
