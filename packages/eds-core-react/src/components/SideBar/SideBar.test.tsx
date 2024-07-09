import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideBar } from '.'
import { SidebarLinkProps } from './SidebarLink'
import { sidebar as tokens } from './SideBar.tokens'
import { favorite_outlined, home, star_half } from '@equinor/eds-icons'

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

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

describe('Sidebar', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <SideBar open={true}>
        <SideBar.Content>
          <SideBar.Toggle />
          <SideBar.Button label="test" icon={home} />
          {defaultMenuItems.map((m) => (
            <SideBar.Link key={m.label} {...m} />
          ))}
          <SideBar.Accordion
            id="123"
            label="Test accordion"
            isExpanded={true}
            icon={favorite_outlined}
          >
            <SideBar.AccordionItem label={'Test accordion item'} />
          </SideBar.Accordion>
        </SideBar.Content>
      </SideBar>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
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
      <SideBar open={false} role="navigation">
        {defaultMenuItems.map((m) => (
          <SideBar.Link key={m.label} {...m} />
        ))}
      </SideBar>,
    )

    expect(screen.getByRole('navigation')).toHaveStyleRule(
      'width',
      `${tokens.minWidth}`,
    )
  })

  it('Renders open width when open', () => {
    render(
      <SideBar open={true} role="navigation">
        {defaultMenuItems.map((m) => (
          <SideBar.Link key={m.label} {...m} />
        ))}
      </SideBar>,
    )
    expect(screen.getByRole('navigation')).toHaveStyleRule(
      'width',
      `${tokens.maxWidth}`,
    )
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

    const collapse = await screen.findByRole('button')
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

    const expand = await screen.findByRole('button')
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

    const expand = await screen.findByRole('button')
    await userEvent.click(expand)

    expect(toggle).toHaveBeenCalled()
    expect(toggle).toHaveBeenCalledWith(true) // Since we send in false to start with
  })
})
