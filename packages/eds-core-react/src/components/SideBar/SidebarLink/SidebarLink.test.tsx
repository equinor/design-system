import React from 'react'
import { render, screen, waitFor, RenderOptions } from '@testing-library/react'
import { SidebarLinkProps } from './index'
import { home } from '@equinor/eds-icons'
import userEvent from '@testing-library/user-event'
import { SideBar } from '../'

const defaultProps: SidebarLinkProps = {
  label: 'Home',
  icon: home,
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { ...options })

function SideBarWrapper(children: React.ReactNode, isOpen?: boolean) {
  return <SideBar open={isOpen}>{children}</SideBar>
}

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})
describe('Sidebar link', () => {
  it('Renders', () => {
    customRender(<SideBar.Link {...defaultProps}></SideBar.Link>, {
      wrapper: ({ children }) => SideBarWrapper(children),
    })
  })

  it('Renders tooltip when closed', async () => {
    customRender(
      <SideBar.Link
        data-testid="sidebar-menu-item"
        {...defaultProps}
      ></SideBar.Link>,
      {
        wrapper: ({ children }) => SideBarWrapper(children),
      },
    )
    const link = screen.getByTestId('sidebar-menu-item')

    await userEvent.hover(link)

    await screen.findByRole('tooltip')
    expect(screen.getByRole('tooltip')).toHaveTextContent('Home')
  })

  it('Does not render tooltip when open', async () => {
    customRender(
      <SideBar.Link
        data-testid="sidebar-menu-item"
        {...defaultProps}
      ></SideBar.Link>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )
    const link = screen.getByTestId('sidebar-menu-item')

    await userEvent.hover(link)

    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    )
  })

  it('Renders label when open', () => {
    customRender(<SideBar.Link {...defaultProps}></SideBar.Link>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })

    expect(screen.getByText('Home')).toHaveTextContent('Home')
  })

  it('Does not render label when closed', () => {
    customRender(<SideBar.Link {...defaultProps}></SideBar.Link>, {
      wrapper: ({ children }) => SideBarWrapper(children),
    })

    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })
})
