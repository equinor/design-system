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
    const { sidesheet } = render(<SideSheet size="large" title="Title" />)

    expect(sidesheet.firstChild).toHaveAttribute('width', '640')
  })
  it('Has provided necessary props', () => {
    const { sidesheet } = render(<SideSheet size="large" title="Title" />)

    expect(sidesheet(title)).toBeDefined()
    expect(sidesheet(size)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { sidesheet } = render(<StyledSidesheet size="large" title="Title" />)
    expect(sidesheet.firstChild).toHaveStyleRule('position', 'relative')
    expect(sidesheet.firstChild).toHaveStyleRule('height', '100px')
    expect(sidesheet.firstChild).toHaveStyleRule('width', '100px')
  })
})
