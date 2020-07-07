/* eslint-disable react/no-array-index-key */
import { Link, graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { readableColor } from 'polished'
import { Table } from '@equinor/eds-core-react'
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

  const { Head, Body, Row, Cell } = Table

  return (
    <Table summary={summary}>
      <Head>
        <Row>
          {headers.map((text) => (
            <Cell as="th" key={camelify(text)} scope="col">
              {text}
            </Cell>
          ))}
        </Row>
      </Head>
      <Body>
        {components.map((component, index) => (
          <Row key={component.component + index}>
            <Cell as="th" key={component.component + index} scope="row">
              <Link
                to={`/components/${kebabify(component.component)}`}
                style={{ color: 'var(--moss-green)', fontSize: '0.875em' }}
              >
                {component.component}
              </Link>
            </Cell>
            {Object.values(component.status).map((statuses, index) => (
              <Cell key={camelify(statuses.join('-')) + index}>
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
              </Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Table>
  )
}

const textColor = '#3d3d3d'

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
  font-size: 0.75em;
  border-radius: 1em;
  display: inline-block;
  height: 2em;
  line-height: 2em;
  white-space: nowrap;
  padding-left: 1em;
  padding-right: 1em;
`

Badge.displayName = 'Badge'

export default ComponentStatus // eslint-disable-line
