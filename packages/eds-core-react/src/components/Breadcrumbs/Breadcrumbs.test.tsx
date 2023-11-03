/* eslint-disable no-undef */
import { render, fireEvent, act, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

const StyledBreadcrumbs = styled(Breadcrumbs)`
  position: absolute;
`

describe('Breadcrumbs', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb href="#">Label 1</Breadcrumb>
        <Breadcrumb href="#">Label 2</Breadcrumb>
        <Breadcrumb href="#">Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('has aria label', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    const breadcrumbs = screen.getByLabelText('breadcrumbs')

    expect(breadcrumbs).toHaveAttribute('aria-label', 'breadcrumbs')
  })
  it('should render three normal breadcrumbs', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )

    expect(screen.getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(screen.getByRole('list')).toHaveTextContent(
      'Label 1/Label 2/Label 3',
    )
  })
  it('should render ellipsis between first and last crumb when collapsed', () => {
    render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )

    expect(screen.getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(screen.getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
  })
  it('should expand from collapsed state when clicking the ellipsis', () => {
    render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )
    const ellipsisButton = screen.getByRole('button')
    expect(screen.getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
    fireEvent.click(ellipsisButton)
    expect(screen.getByRole('list')).toHaveTextContent(
      'Label 1/Label 2/Label 3/Label 4/Label 5/Label 6',
    )
  })
  it('should crop the labels and have tooltip on hover when maxWidth is defined', async () => {
    const mockResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }))
    window.ResizeObserver = mockResizeObserver
    render(
      <Breadcrumbs>
        <Breadcrumb maxWidth={30}>Label 1</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 2</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    const crumb = screen.getAllByText(/^Label\s\d$/)
    expect(crumb[0]).toHaveStyleRule('max-width', '30px')

    fireEvent.mouseEnter(crumb[0])

    await act(() => new Promise((r) => setTimeout(r, 100)))

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeDefined()
  })
  it('can extend the css for the component', () => {
    render(
      <StyledBreadcrumbs>
        <Breadcrumb>Label</Breadcrumb>
      </StyledBreadcrumbs>,
    )

    expect(screen.getByLabelText('breadcrumbs')).toHaveStyleRule(
      'position',
      'absolute',
    )
  })
})
