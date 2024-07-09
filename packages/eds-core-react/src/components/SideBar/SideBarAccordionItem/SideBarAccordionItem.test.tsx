import { ReactNode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideBar } from '../.'
import { AccordionItemProps } from './index'
import { favorite_outlined } from '@equinor/eds-icons'

const defaultProps: AccordionItemProps = {
  label: 'Accordion item',
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
  const toggleExpand = jest.fn()

  return (
    <SideBar open={isOpen}>
      <SideBar.Content>
        <SideBar.Accordion
          label={'Accordion Header'}
          icon={favorite_outlined}
          isExpanded={true}
          toggleExpand={toggleExpand}
        >
          {children}
        </SideBar.Accordion>
      </SideBar.Content>
    </SideBar>
  )
}

describe('AccordionItem in open sidebar', () => {
  it('Renders', () => {
    render(<SideBar.AccordionItem {...defaultProps}></SideBar.AccordionItem>, {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    })
  })

  it('Renders label', () => {
    render(
      <SideBar.AccordionItem
        {...defaultProps}
        role={'link'}
      ></SideBar.AccordionItem>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )

    expect(screen.getByRole('link')).toHaveTextContent('Accordion item')
  })

  it('Does not render tooltip', async () => {
    render(
      <SideBar.AccordionItem
        {...defaultProps}
        role={'link'}
      ></SideBar.AccordionItem>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )

    const accordionItem = screen.getByRole('link')

    await userEvent.hover(accordionItem)

    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    )
  })

  it('If it is present, Sidebar.AccordionItem triggers onClick-callback when clicked', async () => {
    const onClick = jest.fn()

    render(
      <SideBar.AccordionItem
        {...defaultProps}
        onClick={onClick}
        role={'link'}
      ></SideBar.AccordionItem>,
      {
        wrapper: ({ children }) => SideBarWrapper(children, true),
      },
    )

    const accordionItem = screen.getByRole('link')
    await userEvent.click(accordionItem)

    expect(onClick).toHaveBeenCalled()
  })
})
