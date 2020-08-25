/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from './test-utils'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Menu } from '.'

const { MenuItem, MenuSection } = Menu
const StyledMenu = styled(Menu)`
  background: red;
`

afterEach(cleanup)

describe('Menu', () => {
  it('Can extend the css for the component', () => {
    render(
      <StyledMenu>
        <div>some random content</div>
      </StyledMenu>,
    )
    const menuContainer = screen.getByRole('menu', { hidden: true })

    expect(menuContainer).toHaveStyleRule('background', 'red')
  })
  it('is visible when open is true & anchorEl is set', () => {
    render(
      <Menu open>
        <div>some random content</div>
      </Menu>,
    )
    const menuContainer = screen.getByRole('menu').parentElement

    expect(menuContainer).toHaveStyleRule('visibility', 'visible')
    expect(menuContainer).toHaveStyleRule('left', '0')
    expect(menuContainer).toHaveStyleRule('top', '2px')
  })
  it('has rendered MenuItem', () => {
    render(
      <Menu open>
        <MenuItem>Item 1</MenuItem>
      </Menu>,
    )
    const menuItem = screen.getByText('Item 1')

    expect(menuItem).toBeDefined()
  })

  it('has rendered MenuSection with MenuItem & title', () => {
    render(
      <Menu open>
        <MenuSection title="Section title">
          <MenuItem>Item 1</MenuItem>
        </MenuSection>
      </Menu>,
    )
    const menuItem = screen.getByText('Item 1')
    const menuSection = screen.getByText('Section title')

    expect(menuItem).toBeDefined()
    expect(menuSection).toBeDefined()
  })
})
