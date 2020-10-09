/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen, fireEvent } from './test-utils'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
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
      <StyledMenu open>
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

  it('has called onClose when MenuItem is clicked', () => {
    const handleOnClose = jest.fn()
    const handleOnClick = jest.fn()

    render(
      <Menu open onClose={handleOnClose}>
        <MenuItem onClick={handleOnClick}>Item 1</MenuItem>
      </Menu>,
    )

    const menuItem = screen.getByText('Item 1')

    fireEvent.click(menuItem)

    expect(handleOnClick).toHaveBeenCalled()
    expect(handleOnClose).toHaveBeenCalled()
  })

  it('has first menuItem focused when focus is set to first', () => {
    render(
      <Menu open focus="first">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>,
    )
    const menuItem = screen.getByText('Item 1').parentElement

    expect(document.activeElement == menuItem).toBeTruthy()
  })

  it('has last menuItem focused when focus is set to last', () => {
    render(
      <Menu open focus="last">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </Menu>,
    )
    const menuItem = screen.getByText('Item 3').parentElement

    expect(document.activeElement == menuItem).toBeTruthy()
  })
  it('has called onClose when MenuItem is clicked from inside a MenuSection', () => {
    const handleOnClose = jest.fn()
    const handleOnClick = jest.fn()

    render(
      <Menu open onClose={handleOnClose}>
        <MenuSection title="test">
          <MenuItem onClick={handleOnClick}>Item 1</MenuItem>
        </MenuSection>
      </Menu>,
    )

    const menuItem = screen.getByText('Item 1')

    fireEvent.click(menuItem)

    expect(handleOnClick).toHaveBeenCalled()
    expect(handleOnClose).toHaveBeenCalled()
  })
})
