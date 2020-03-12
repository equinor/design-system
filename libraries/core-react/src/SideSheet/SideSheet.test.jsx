/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { SideSheet } from '.'

const StyledSidesheet = styled(SideSheet)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('SideSheet', () => {
  it('Has correct size', () => {
    const { container } = render(<SideSheet size="large" title="Title" />)

    expect(container.firstChild).toHaveAttribute('width', '640')
  })
  it('Has correct title', () => {
    const { container } = render(<SideSheet size="large" title="Title" />)

    expect(container.firstChild).toHaveAttribute('width', '640')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSidesheet size="large" title="Title" />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('height', '100px')
    expect(container.firstChild).toHaveStyleRule('width', '100px')
  })
})
