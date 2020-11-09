/* eslint-disable no-undef */
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

const StyledBreadcrumbs = styled(Breadcrumbs)`
  position: absolute;
`

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

    expect(getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
  })
  it('should expand from collapsed state when clicking the ellipsis', () => {
    const { getByRole } = render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )
    const ellipsisButton = getByRole('button')
    expect(getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
    fireEvent.click(ellipsisButton)
    expect(getByRole('list')).toHaveTextContent(
      'Label 1/Label 2/Label 3/Label 4/Label 5/Label 6',
    )
  })
  it('should crop the labels and have tooltip on hover when maxWidth is defined', () => {
    const { getAllByText } = render(
      <Breadcrumbs>
        <Breadcrumb maxWidth={30}>Label 1</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 2</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    const crumb = getAllByText(/^Label\s\d$/)
    expect(crumb[0]).toHaveStyleRule('max-width', '30px')
    fireEvent.mouseEnter(crumb[0])
    expect(crumb[0].parentNode.parentNode.lastChild).toHaveAttribute(
      'role',
      'tooltip',
    )
  })
  it('can extend the css for the component', () => {
    const { container } = render(
      <StyledBreadcrumbs>
        <Breadcrumb>Label</Breadcrumb>
      </StyledBreadcrumbs>,
    )

    expect(container.firstChild).toHaveStyleRule('position', 'absolute')
  })
})
