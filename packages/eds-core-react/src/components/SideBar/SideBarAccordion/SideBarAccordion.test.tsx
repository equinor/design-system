import { ReactNode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { favorite_outlined } from '@equinor/eds-icons'
import { SideBar } from '../.'
import { SidebarAccordionProps } from './index'

const defaultProps: SidebarAccordionProps = {
  label: 'Test',
  icon: favorite_outlined,
}

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

function SideBarWrapper(children: ReactNode, isOpen?: boolean) {
  return (
    <SideBar open={isOpen}>
      <SideBar.Content>{children}</SideBar.Content>
    </SideBar>
  )
}

describe('Accordion in open sidebar', () => {
  it('Renders', () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })
  })

  it('Renders label', () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })

    expect(screen.getByRole('button')).toHaveTextContent('Test')
  })

  it('Does not render tooltip', async () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })

    const accordionButton = screen.getByRole('button')

    await userEvent.hover(accordionButton)

    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    )
  })

  it('If they are present, Sidebar.Accordion triggers toggleExpand- and onClick-callback when clicked', async () => {
    const onClick = jest.fn()
    const toggleExpand = jest.fn()

    render(
      <SideBar.Accordion
        {...defaultProps}
        isExpanded={false}
        onClick={onClick}
        toggleExpand={toggleExpand}
      ></SideBar.Accordion>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )

    const accordionButton = screen.getByRole('button')
    await userEvent.click(accordionButton)

    expect(onClick).toHaveBeenCalled()
    expect(toggleExpand).toHaveBeenCalled()
  })

  it('controls its own open-state when toggleExpand is not present', async () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })

    const accordionButton = screen.getByRole('button')

    await userEvent.click(accordionButton)

    const accordionPanel = screen.getByRole('region')

    expect(accordionButton).toHaveAttribute('aria-expanded', 'true')
    expect(accordionPanel).toBeInTheDocument()
  })

  it('uses isExpanded to decide open-state on render', () => {
    render(
      <SideBar.Accordion
        {...defaultProps}
        isExpanded={true}
      ></SideBar.Accordion>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )

    const accordionPanel = screen.getByRole('region')
    expect(accordionPanel).toBeInTheDocument()
  })

  it('it controls its own open-state on click if toggleExpand is not present, even if isExpanded is always true', async () => {
    render(
      <SideBar.Accordion
        {...defaultProps}
        isExpanded={true}
      ></SideBar.Accordion>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )
    const accordionButton = screen.getByRole('button')

    await userEvent.click(accordionButton)

    let accordionPanel = screen.queryByRole('region')

    expect(accordionButton).toHaveAttribute('aria-expanded', 'false')
    expect(accordionPanel).not.toBeInTheDocument()

    await userEvent.click(accordionButton)

    accordionPanel = screen.getByRole('region')

    expect(accordionButton).toHaveAttribute('aria-expanded', 'true')
    expect(accordionPanel).toBeInTheDocument()
  })
})

describe('Accordion in closed sidebar', () => {
  it('Renders', () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, false),
    })
  })

  it('Does not render label', () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, false),
    })

    expect(screen.getByRole('button')).not.toHaveTextContent('Test')
  })

  it('Renders tooltip on hover', async () => {
    render(<SideBar.Accordion {...defaultProps}></SideBar.Accordion>, {
      wrapper: ({ children }) => SideBarWrapper(children, false),
    })

    const accordionButton = screen.getByRole('button')

    await userEvent.hover(accordionButton)
    await screen.findByRole('tooltip')

    expect(screen.getByRole('tooltip')).toHaveTextContent('Test')
  })

  it('If present, Sidebar.Accordion triggers only onClick callback when clicked', async () => {
    const onClick = jest.fn()
    const toggleExpand = jest.fn()

    render(
      <SideBar.Accordion
        {...defaultProps}
        isExpanded={false}
        onClick={onClick}
        toggleExpand={toggleExpand}
      >
        <SideBar.AccordionItem label={'Accordion item'} />
      </SideBar.Accordion>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, false),
      },
    )

    const accordionButton = screen.getByRole('button')
    await userEvent.click(accordionButton)

    expect(onClick).toHaveBeenCalled()
    expect(toggleExpand).not.toHaveBeenCalled()
  })

  it('Click on Sidebar.Accordion opens as a Menu', async () => {
    render(
      <SideBar.Accordion {...defaultProps}>
        <SideBar.AccordionItem label={'Accordion item'} />
      </SideBar.Accordion>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, false),
      },
    )

    const accordionButton = screen.getByRole('button')
    await userEvent.click(accordionButton)

    const accordionMenu = screen.getByRole('menu')

    expect(accordionMenu).toBeInTheDocument()
  })
})
