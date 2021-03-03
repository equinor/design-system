/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen, fireEvent } from './test-utils'
import { waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import styled from 'styled-components'
import { Menu } from '.'
import { MenuProps } from './Menu'

const { MenuItem, MenuSection } = Menu

// We override Menu for testing and set props to partial because AnchorEl is applied to children in custom render function
const TestMenu = Menu as React.ForwardRefExoticComponent<Partial<MenuProps>>

const StyledMenu = styled(TestMenu)`
  background: red;
`

afterEach(cleanup)

describe('Menu', () => {
  it('Can extend the css for the component', async () => {
    render(
      <StyledMenu open>
        <div>some random content</div>
      </StyledMenu>,
    )
    const menuContainer = screen.getByRole('menu', { hidden: true })

    await waitFor(() =>
      expect(menuContainer).toHaveStyleRule('background', 'red'),
    )
  })
  it('is visible when open is true & anchorEl is set', async () => {
    render(
      <TestMenu open placement="right-start">
        <div>some random content</div>
      </TestMenu>,
    )
    const menuContainer = screen.getByRole('menu').parentElement
    await waitFor(() =>
      expect(menuContainer).toHaveStyleRule('visibility', 'visible'),
    )
    expect(menuContainer).toHaveAttribute(
      'data-popper-placement',
      'right-start',
    )
  })
  it('has rendered MenuItem', async () => {
    render(
      <TestMenu open>
        <MenuItem>Item 1</MenuItem>
      </TestMenu>,
    )
    const menuItem = screen.getByText('Item 1')
    await waitFor(() => expect(menuItem).toBeDefined())
  })

  it('has rendered MenuSection with MenuItem & title', async () => {
    render(
      <TestMenu open>
        <MenuSection title="Section title">
          <MenuItem>Item 1</MenuItem>
        </MenuSection>
      </TestMenu>,
    )
    const menuItem = screen.getByText('Item 1')
    const menuSection = screen.getByText('Section title')

    await waitFor(() => expect(menuItem).toBeDefined())
    expect(menuSection).toBeDefined()
  })

  it('has called onClose when MenuItem is clicked', async () => {
    const handleOnClose = jest.fn()
    const handleOnClick = jest.fn()

    render(
      <TestMenu open onClose={handleOnClose}>
        <MenuItem onClick={handleOnClick}>Item 1</MenuItem>
      </TestMenu>,
    )

    const menuItem = screen.getByText('Item 1')

    fireEvent.click(menuItem)

    await waitFor(() => expect(handleOnClick).toHaveBeenCalled())
    expect(handleOnClose).toHaveBeenCalled()
  })

  it('has first menuItem focused when focus is set to first', async () => {
    render(
      <TestMenu open focus="first">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </TestMenu>,
    )
    const menuItem = screen.getByText('Item 1').parentElement

    await waitFor(() => expect(document.activeElement == menuItem).toBeTruthy())
  })

  it('has last menuItem focused when focus is set to last', async () => {
    render(
      <TestMenu open focus="last">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </TestMenu>,
    )
    const menuItem = screen.getByText('Item 3').parentElement

    await waitFor(() => expect(document.activeElement == menuItem).toBeTruthy())
  })
  it('has called onClose when MenuItem is clicked from inside a MenuSection', async () => {
    const handleOnClose = jest.fn()
    const handleOnClick = jest.fn()

    render(
      <TestMenu open onClose={handleOnClose}>
        <MenuSection title="test">
          <MenuItem onClick={handleOnClick}>Item 1</MenuItem>
        </MenuSection>
      </TestMenu>,
    )

    const menuItem = screen.getByText('Item 1')

    fireEvent.click(menuItem)

    await waitFor(() => expect(handleOnClick).toHaveBeenCalled())
    expect(handleOnClose).toHaveBeenCalled()
  })
})
