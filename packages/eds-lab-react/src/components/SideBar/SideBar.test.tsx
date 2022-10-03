import { render, screen, cleanup } from '@testing-library/react'
//import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { SideBar } from '.'
import { SidebarLinkProps } from './SidebarLink'
import { sidebar as tokens } from './SideBar.tokens'
import { home, star_half } from '@equinor/eds-icons'

const defaultMenuItems: SidebarLinkProps[] = [
  {
    label: 'Home',
    icon: home,
  },
  {
    label: 'Another Link',
    icon: star_half,
  },
]

afterEach(cleanup)
const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

describe('Sidebar', () => {
  it('Sidebar renders', () => {
    render(
      <SideBar>
        {defaultMenuItems.map((m) => {
          return <SideBar.Link key={m.label} {...m} />
        })}
      </SideBar>,
    )
  })

  it('Renders closed width when closed', () => {
    render(
      <SideBar open={false}>
        {defaultMenuItems.map((m) => (
          <SideBar.Link key={m.label} {...m} />
        ))}
      </SideBar>,
    )

    expect(screen.getAllByRole('generic')[2]).toHaveStyle({
      width: tokens.minWidth,
    })
  })

  it('Renders open width when open', () => {
    render(
      <SideBar open={true}>
        {defaultMenuItems.map((m) => (
          <SideBar.Link key={m.label} {...m} />
        ))}
      </SideBar>,
    )

    expect(screen.getAllByRole('generic')[2]).toHaveStyle({
      width: tokens.maxWidth,
    })
  })

  it('Triggers onToggle callback when closed', async () => {
    const cb = jest.fn()
    render(
      <SideBar open={true} onToggle={cb}>
        <SideBar.Content>
          <SideBar.Toggle />
          {defaultMenuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
      </SideBar>,
    )

    const collapse = screen.getByRole('button')
    await userEvent.click(collapse)

    expect(cb).toHaveBeenCalled()
  })

  it('Triggers onToggle callback when opened', async () => {
    const cb = jest.fn()
    render(
      <SideBar open={false} onToggle={cb}>
        <SideBar.Content>
          <SideBar.Toggle />
          {defaultMenuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
      </SideBar>,
    )

    const expand = screen.getByRole('button')
    await userEvent.click(expand)

    expect(cb).toHaveBeenCalled()
  })

  it('onToggle send correct state back', async () => {
    const toggle = jest.fn()
    render(
      <SideBar open={false} onToggle={toggle}>
        <SideBar.Content>
          <SideBar.Toggle />
          {defaultMenuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
        </SideBar.Content>
      </SideBar>,
    )

    const expand = screen.getByRole('button')
    await userEvent.click(expand)

    expect(toggle).toBeCalled()
    expect(toggle).toHaveBeenCalledWith(true) // Since we send in false to start with
  })
})
