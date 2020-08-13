/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Pagination } from '.'

const StyledPagination = styled(Pagination)`
  position: absolute;
`

afterEach(cleanup)

describe('Pagination', () => {
  // it('Has all provided content', () => {
  //   render(<Pagination />)
  // })
  // it('Has scrollable content when scrollable props is present', () => {})

  it('Can extend the css for the component', () => {
    const { container } = render(<StyledPagination totalItems={10} />)
    const pagination = container.firstChild
    expect(pagination).toHaveStyleRule('position', 'absolute')
  })
})
