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

  const headers = data.allComponentStatusYaml.edges[0].node.headers
  const components = data.allComponentStatusYaml.edges[0].node.components
  const camelify = title => title.toLowerCase().split(' ').map((word, index) => (
    index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
  )).join('')

  return (
    <table className='ComponentSummaryTable' summary='some summary'>
      <caption>Some caption</caption>
      <thead>
        <tr>
          {
            headers.map((text, index) => (
              <th key={index}>{ text }</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          components.map((component, index) => (
            <tr>
              <th>{ component.component }</th>
              {
                Object.keys(component.status).map((key, index) => (
                  <td>
                    {
                      component.status[key].map((status, index) => (
                        <span className={`StatusBadge StatusBadge--${camelify(status)}`}>{ status }</span>
                      ))
                    }
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default ComponentStatus
