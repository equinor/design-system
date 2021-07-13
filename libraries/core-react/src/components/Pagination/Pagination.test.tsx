/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Pagination } from '.'

const StyledPagination = styled(Pagination)`
  position: absolute;
`

afterEach(cleanup)

describe('Pagination', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Pagination totalItems={10} />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('can extend the css for the component', () => {
    const { container } = render(<StyledPagination totalItems={10} />)
    const pagination = container.firstChild
    expect(pagination).toHaveStyleRule('position', 'absolute')
  })
  it('has aria label', () => {
    const { container } = render(<Pagination totalItems={10} />)
    const pagination = container.firstChild
    expect(pagination).toHaveAttribute('aria-label', 'pagination')
  })
  it('has aria label on pages', () => {
    const { getAllByRole } = render(
      <Pagination totalItems={100} defaultPage={3} />,
    )
    expect(getAllByRole('listitem')[0].firstChild).toHaveAttribute(
      'aria-label',
      'Go to previous page',
    )
    expect(getAllByRole('listitem')[1].firstChild).toHaveAttribute(
      'aria-label',
      'Go to page 1',
    )
    expect(getAllByRole('listitem')[3].firstChild).toHaveAttribute(
      'aria-label',
      'Current page, page 3',
    )
  })
  it('should render correct number of pages', () => {
    const { getAllByRole } = render(
      <Pagination totalItems={4} itemsPerPage={1} />,
    )
    expect(getAllByRole('listitem')).toHaveLength(6) // totalItems + 2: the < + > buttons)
  })
  it('should render ellipsis if number of pages is larger than 7', () => {
    render(<Pagination totalItems={8} itemsPerPage={1} />)
    expect(screen.getByLabelText('Ellipsis of pages')).toBeDefined()
  })
  it('should render two ellipsises if number of pages is larger than 9 and default page is 5', () => {
    render(<Pagination totalItems={9} itemsPerPage={1} defaultPage={5} />)

    expect(screen.getAllByLabelText('Ellipsis of pages')[0]).toBeDefined()
    expect(screen.getAllByLabelText('Ellipsis of pages')[1]).toBeDefined()
  })
  it('should render next and previous buttons', () => {
    const { getAllByRole } = render(
      <Pagination totalItems={3} itemsPerPage={1} />,
    )
    expect(getAllByRole('button')[0]).toHaveAttribute(
      'aria-label',
      'Go to previous page',
    )
    expect(getAllByRole('button')[4]).toHaveAttribute(
      'aria-label',
      'Go to next page',
    )
  })
})
