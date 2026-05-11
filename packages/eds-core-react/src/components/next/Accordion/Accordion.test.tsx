import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Accordion } from '.'

const renderBasic = (
  itemProps: React.ComponentProps<typeof Accordion.Item> = {},
) =>
  render(
    <Accordion data-testid="root">
      <Accordion.Item data-testid="item" {...itemProps}>
        <Accordion.Header>Title</Accordion.Header>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion.Item>
    </Accordion>,
  )

describe('Accordion (next)', () => {
  describe('Rendering', () => {
    it('renders header and panel', () => {
      renderBasic()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders item as <details>', () => {
      renderBasic()
      expect(screen.getByTestId('item').tagName).toBe('DETAILS')
    })

    it('applies custom className to root', () => {
      render(
        <Accordion data-testid="root" className="custom">
          <Accordion.Item>
            <Accordion.Header>Title</Accordion.Header>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      )
      expect(screen.getByTestId('root')).toHaveClass('eds-accordion', 'custom')
    })

    it('forwards ref on root', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(
        <Accordion ref={ref}>
          <Accordion.Item>
            <Accordion.Header>Title</Accordion.Header>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Open state', () => {
    it('is closed by default', () => {
      renderBasic()
      expect(screen.getByTestId('item')).not.toHaveAttribute('open')
    })

    it('respects defaultOpen', () => {
      renderBasic({ defaultOpen: true })
      expect(screen.getByTestId('item')).toHaveAttribute('open')
    })

    it('toggles on header click (uncontrolled)', async () => {
      const user = userEvent.setup()
      renderBasic()
      const item = screen.getByTestId('item')
      await user.click(screen.getByText('Title'))
      expect(item).toHaveAttribute('open')
      await user.click(screen.getByText('Title'))
      expect(item).not.toHaveAttribute('open')
    })

    it('supports controlled open with onOpenChange', async () => {
      const user = userEvent.setup()
      const Controlled = () => {
        const [open, setOpen] = useState(false)
        return (
          <Accordion>
            <Accordion.Item
              data-testid="item"
              open={open}
              onOpenChange={setOpen}
            >
              <Accordion.Header>Title</Accordion.Header>
              <Accordion.Panel>Content</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )
      }
      render(<Controlled />)
      const item = screen.getByTestId('item')
      expect(item).not.toHaveAttribute('open')
      await user.click(screen.getByText('Title'))
      expect(item).toHaveAttribute('open')
    })
  })

  describe('Exclusive group', () => {
    it('shares a name across items when exclusive is set', () => {
      render(
        <Accordion exclusive>
          <Accordion.Item data-testid="one">
            <Accordion.Header>One</Accordion.Header>
            <Accordion.Panel>A</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item data-testid="two">
            <Accordion.Header>Two</Accordion.Header>
            <Accordion.Panel>B</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      )
      const first = screen.getByTestId('one').getAttribute('name')
      const second = screen.getByTestId('two').getAttribute('name')
      expect(first).toBeTruthy()
      expect(first).toBe(second)
    })

    it('omits the name attribute when not exclusive', () => {
      renderBasic()
      expect(screen.getByTestId('item')).not.toHaveAttribute('name')
    })
  })

  describe('Accessibility', () => {
    it('has no violations when closed', async () => {
      const { container } = renderBasic()
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations when open', async () => {
      const { container } = renderBasic({ defaultOpen: true })
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
