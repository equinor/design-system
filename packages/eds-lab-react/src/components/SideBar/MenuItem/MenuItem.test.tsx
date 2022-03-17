import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MenuItem, MenuItemProps } from './index'
import { home } from '@equinor/eds-icons'
//import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideBar } from '../SideBar'

const defaultProps: MenuItemProps = {
  name: 'Home',
  currentUrl: 'http://localhost:3000/home',
  icon: home,
  link: 'home',
}

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { ...options })

function SideBarWrapper(children: React.ReactChildren, isOpen?: boolean) {
  return <SideBar open={isOpen}>{children}</SideBar>
}

test('Renders', () => {
  customRender(<MenuItem {...defaultProps}></MenuItem>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })
})

test('Renders tooltip when closed', async () => {
  customRender(<MenuItem {...defaultProps}></MenuItem>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })
  const link = screen.getByTestId('sidebar-menu-item')

  userEvent.hover(link)

  await screen.findByRole('tooltip')
  expect(screen.getByRole('tooltip')).toHaveTextContent('Home')
})

test('Does not render tooltip when open', async () => {
  customRender(<MenuItem {...defaultProps}></MenuItem>, {
    wrapper: ({ children }) => SideBarWrapper(children, true),
  })
  const link = screen.getByTestId('sidebar-menu-item')

  userEvent.hover(link)

  await waitFor(() =>
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
  )
})

test('Renders name when open', () => {
  customRender(<MenuItem {...defaultProps}></MenuItem>, {
    wrapper: ({ children }) => SideBarWrapper(children, true),
  })

  expect(screen.getByText('Home')).toHaveTextContent('Home')
})

test('Does not render name when closed', () => {
  customRender(<MenuItem {...defaultProps}></MenuItem>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })

  expect(screen.queryByText('Home')).not.toBeInTheDocument()
})
