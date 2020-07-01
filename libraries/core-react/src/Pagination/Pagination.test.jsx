/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { pagination as tokens } from './.tokens'
import { Pagination } from '.'

const { Actions, Title, CustomContent } = 

const { activeColor } = tokens

const StyledPagination = styled(Pagination)`
  background: red;
  min-height: ${minHeight};
  width: ${width};
`

afterEach(cleanup)

describe('Pagination', () => {
  it('Has all provided content', () => {
    render(<Pagination/>)
  })
  it('Has scrollable content when scrollable props is present', () => {

  })

  it('Can extend the css for the component', () => {

  })
})
