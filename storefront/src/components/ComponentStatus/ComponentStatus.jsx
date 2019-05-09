import { Link, graphql, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classNames from 'classnames'

const ComponentStatus = () => {
  const data = useStaticQuery(graphql`
    query ComponentStatusQuery {
      allComponentStatusYaml {
        edges {
          node {
            headers
            components {
              component
              status {
                figma
                vanilla
                react
              }
            }
          }
        }
      }
    }
  `)

  return (
    <p>Component Status</p>
  )
}

export default ComponentStatus
