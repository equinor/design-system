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
  it('Works', () => {
    const { sidesheet } = render(<SideSheet variant="large" title="Title" />)

    expect(sidesheet).toMatchSnapshot()
  })
  it('Has correct width', () => {
    const { container } = render(<SideSheet variant="large" title="Title" />)
    const sidesheet = container.firstChild
    expect(sidesheet).toHaveStyleRule('width', '480px')
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const variant = 'large'
    const { queryByText } = render(
      <SideSheet variant={variant} title={title} />,
    )
    expect(queryByText(title)).toBeDefined()
    expect(queryByText(variant)).toBeDefined()
  })
  it('Has top: 64px if topbar is visible', () => {
    const { container } = render(
      <SideSheet variant="large" title="Title" topBarVisible={1} />,
    )
    const sidesheet = container.firstChild
    expect(sidesheet).toHaveStyleRule('top', '64px')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSidesheet />)
    const sidesheet = container.firstChild
    expect(sidesheet).toHaveStyleRule('position', 'relative')
    expect(sidesheet).toHaveStyleRule('height', '100px')
    expect(sidesheet).toHaveStyleRule('width', '100px')
  })
})
