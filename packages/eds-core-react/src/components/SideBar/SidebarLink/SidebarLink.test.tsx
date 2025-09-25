import React from 'react'
import {
  render,
  screen,
  waitFor,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SidebarLinkProps } from './index'
import { home } from '@equinor/eds-icons'
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
  return (
    <SideBar open={isOpen}>
      <SideBar.Content>{children}</SideBar.Content>
    </SideBar>
  )
}

const roMock = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

let rafOrig: typeof window.requestAnimationFrame | undefined
let cafOrig: typeof window.cancelAnimationFrame | undefined

beforeAll(() => {
  if (!window.ResizeObserver) window.ResizeObserver = roMock

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return 100
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return 200
    },
  })

  const rect = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    top: 0,
    left: 0,
    bottom: 20,
    right: 100,
    toJSON: () => {},
  }
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(() => rect as DOMRect)

  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get() {
      return document.body
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return 24
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return 24
    },
  })

  rafOrig = window.requestAnimationFrame
  cafOrig = window.cancelAnimationFrame
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 0) as unknown as number

    window.cancelAnimationFrame = (id: number) => clearTimeout(id)
  }
})

afterAll(() => {
  if (!rafOrig) {
    delete (window as any).requestAnimationFrame

    delete (window as any).cancelAnimationFrame
  } else {
    window.requestAnimationFrame = rafOrig
    window.cancelAnimationFrame = cafOrig!
  }
})

describe('Sidebar link', () => {
  it('Renders', () => {
    customRender(<SideBar.Link {...defaultProps}></SideBar.Link>, {
      wrapper: ({ children }) => SideBarWrapper(children, false),
    })
  })

  it('Renders tooltip when closed', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    customRender(
      <SideBar.Link data-testid="sidebar-menu-item" {...defaultProps} />,
      { wrapper: ({ children }) => SideBarWrapper(children, false) },
    )

    const link = screen.getByTestId('sidebar-menu-item')

    fireEvent.pointerEnter(link)
    await user.hover(link)
    fireEvent.focus(link)

    await act(async () => {
      jest.advanceTimersByTime(1200)
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const tooltip = await screen.findByRole('tooltip', { hidden: true })
    expect(tooltip).toHaveTextContent('Home')

    jest.useRealTimers()
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

    fireEvent.mouseEnter(link)

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
      wrapper: ({ children }) => SideBarWrapper(children, false),
    })

    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })
})
