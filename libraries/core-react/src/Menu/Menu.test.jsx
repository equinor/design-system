/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from './test-utils'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Menu } from '.'

const StyledMenu = styled(Menu)`
  background: red;
`

afterEach(cleanup)

describe('Menu', () => {
  it('Can extend the css for the component', () => {
    render(
      <StyledMenu open>
        <div>some random content</div>
      </StyledMenu>,
    )
    const menuContainer = screen.getByRole('menu')

    expect(menuContainer).toHaveStyleRule('background', 'red')
  })
  it('is visible when open is true & anchorEl is set', () => {
    // anchorEl is assigned in render function for easier testing
    render(
      <Menu open>
        <div>some random content</div>
      </Menu>,
    )
    const menuContainer = screen.getByRole('menu').parentElement

    expect(menuContainer).toHaveStyleRule('visibility', 'visible')
  })
})
