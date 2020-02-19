/* eslint-disable react/no-array-index-key */
import { Link, graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { readableColor } from 'polished'
import { camelify, kebabify } from '../../utils'

const ComponentStatus = () => {
  const data = useStaticQuery(graphql`
    query ComponentStatusQuery {
      allComponentStatusYaml {
        edges {
          node {
            headers
            summary
            components {
              component
              status {
                documentation
                figma
                react
              }
            }
          }
        }
      }
    }
  `)

  const {
    headers,
    summary,
    components,
  } = data.allComponentStatusYaml.edges[0].node

  return (
    <Table summary={summary}>
      <thead>
        <Tr>
          {headers.map((text, index) => (
            <ThH key={camelify(text)} scope="col">
              {text}
            </ThH>
          ))}
        </Tr>
      </thead>
      <tbody>
        {components.map((component, index) => (
          <Tr key={component.component + index}>
            <ThV key={component.component + index} scope="row">
              <Link to={`/components/${kebabify(component.component)}`}>
                {component.component}
              </Link>
            </ThV>
            {Object.values(component.status).map((statuses, index) => (
              <Td key={camelify(statuses.join('-')) + index}>
                <Badges>
                  {statuses.map((status, index) => (
                    <Badge
                      key={camelify(status) + index}
                      variant={camelify(status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </Badges>
              </Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}

const textColor = '#3d3d3d'

const Table = styled.table`
  border-collapse: collapse;
  color: ${textColor};
`

Table.displayName = 'Table'

const Tr = styled.tr`
  tbody &:nth-child(odd) {
    th,
    td {
      background: white;
    }
  }
`

Tr.displayName = 'TableRow'

const cellPadding = `
  padding: 0.75em 1.5em;
`

const ThH = styled.th`
  text-align: left;
  ${cellPadding}
  font-weight: 500 !important;
`

ThH.displayName = 'TableHeaderHorizontal'

const ThV = styled.th`
  text-align: left;
  ${cellPadding}
  font-weight: 400 !important;
`

ThV.displayName = 'TableHeaderVertical'

const Td = styled.td`
  ${cellPadding}
`

Td.displayName = 'TableCell'

const badgeBgColors = {
  notAvailable: '#dcdcdc',
  underConstruction: '#ffe7d6',
  startedDevelopment: '#ffe7d6',
  inProgress: '#ffe7d6',
  new: '#007079',
  available: '#e6faec',
  alpha: '#D5EAF4',
  beta: '#A8CED1',
  inCodeReview: '#A8CED1',
}

const Badges = styled.div`
  display: inline-grid;
  grid-gap: 0.5rem;
  grid-auto-flow: column;
`

Badges.displayName = 'Badges'

const Badge = styled.span`
  background: ${({ variant }) => badgeBgColors[variant]};
  color: ${({ variant }) =>
    readableColor(badgeBgColors[variant], textColor, '#fff')};
  margin-top: 0 !important; /* TODO: Remove lobotomized owl selector */
  font-size: 0.625em;
  border-radius: 1em;
  display: inline-block;
  height: 2em;
  line-height: 2em;
  white-space: nowrap;
  padding-left: 1em;
  padding-right: 1em;
`

Badge.displayName = 'Badge'

export default ComponentStatus
