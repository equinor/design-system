/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

const StyledBreadcrumbs = styled(Breadcrumbs)`
  position: absolute;
`

const StyledBreadcrumb = styled(Breadcrumb)`
  position: absolute;
`

const BreadcrumbsCollapsed = () => (
  <Breadcrumbs collapse>
    <Breadcrumb>Label 1</Breadcrumb>
    <Breadcrumb>Label 2</Breadcrumb>
    <Breadcrumb>Label 3</Breadcrumb>
    <Breadcrumb>Label 4</Breadcrumb>
  </Breadcrumbs>
)

afterEach(cleanup)

describe('Breadcrumbs', () => {
  it('has aria label', () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    const breadcrumbs = container.firstChild

    expect(breadcrumbs).toHaveAttribute('aria-label', 'breadcrumbs')
  })
  it('should render three normal breadcrumbs', () => {
    const { getByRole, getAllByRole } = render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )

    expect(getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(getByRole('list')).toHaveTextContent('Label 1/Label 2/Label 3')
  })
  it('should render ellipsis between first and last crumb when collapsed', () => {
    const { getByRole, getAllByRole } = render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )

    expect(getAllByRole('listitem', { hidden: false })).toHaveLength(2)
    expect(getByRole('list')).toHaveTextContent('Label 1/.../Label 6')
  })
  it('can extend the css for the component', () => {
    const { container } = render(<StyledBreadcrumbs>Hei</StyledBreadcrumbs>)

    expect(container.firstChild).toHaveStyleRule('position', 'absolute')
  })
})
