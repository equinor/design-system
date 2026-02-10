import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Menu } from '.'

describe('Menu (next)', () => {
  describe('Rendering', () => {
    it('renders menu items when open', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor} data-testid="eds-menu">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu>,
      )

      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.getAllByRole('menuitem')).toHaveLength(2)
      expect(screen.getByText('Item 1')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })

    it('applies custom className to menu', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor} className="custom">
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      expect(screen.getByRole('menu')).toHaveClass('eds-menu', 'custom')

      document.body.removeChild(anchor)
    })

    it('forwards ref', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const ref = { current: null as HTMLDivElement | null }

      render(
        <Menu ref={ref} open anchorEl={anchor}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)

      document.body.removeChild(anchor)
    })

    it('spreads additional props', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor} data-testid="test" data-custom="value">
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')

      document.body.removeChild(anchor)
    })
  })

  describe('MenuItem', () => {
    it('renders as a button by default', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>Click me</Menu.Item>
        </Menu>,
      )

      const item = screen.getByRole('menuitem')
      expect(item.tagName).toBe('BUTTON')
      expect(item).toHaveTextContent('Click me')

      document.body.removeChild(anchor)
    })

    it('calls onClick when clicked', async () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const handleClick = jest.fn()

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item onClick={handleClick}>Click me</Menu.Item>
        </Menu>,
      )

      await userEvent.click(screen.getByRole('menuitem'))
      expect(handleClick).toHaveBeenCalledTimes(1)

      document.body.removeChild(anchor)
    })

    it('does not fire onClick when disabled', async () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const handleClick = jest.fn()

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item disabled onClick={handleClick}>
            Disabled
          </Menu.Item>
        </Menu>,
      )

      await userEvent.click(screen.getByRole('menuitem'))
      expect(handleClick).not.toHaveBeenCalled()

      document.body.removeChild(anchor)
    })

    it('applies active state via data attribute', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item active>Active item</Menu.Item>
        </Menu>,
      )

      expect(screen.getByRole('menuitem')).toHaveAttribute('data-active')

      document.body.removeChild(anchor)
    })
  })

  describe('MenuSection', () => {
    it('renders section with title', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Section title="Actions">
            <Menu.Item>Item 1</Menu.Item>
          </Menu.Section>
        </Menu>,
      )

      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByRole('group')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })

    it('renders section without title', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Section>
            <Menu.Item>Item 1</Menu.Item>
          </Menu.Section>
        </Menu>,
      )

      expect(screen.getByRole('group')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates items with ArrowDown/ArrowUp', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>First</Menu.Item>
          <Menu.Item>Second</Menu.Item>
          <Menu.Item>Third</Menu.Item>
        </Menu>,
      )

      const menu = screen.getByRole('menu')
      const items = screen.getAllByRole('menuitem')

      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(items[0]).toHaveAttribute('data-focused')

      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(items[1]).toHaveAttribute('data-focused')

      fireEvent.keyDown(menu, { key: 'ArrowUp' })
      expect(items[0]).toHaveAttribute('data-focused')

      document.body.removeChild(anchor)
    })

    it('wraps focus at boundaries', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>First</Menu.Item>
          <Menu.Item>Last</Menu.Item>
        </Menu>,
      )

      const menu = screen.getByRole('menu')
      const items = screen.getAllByRole('menuitem')

      // Navigate to last, then wrap to first
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(items[0]).toHaveAttribute('data-focused')

      document.body.removeChild(anchor)
    })

    it('skips disabled items during navigation', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>First</Menu.Item>
          <Menu.Item disabled>Disabled</Menu.Item>
          <Menu.Item>Third</Menu.Item>
        </Menu>,
      )

      const menu = screen.getByRole('menu')
      const items = screen.getAllByRole('menuitem')

      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(items[2]).toHaveAttribute('data-focused')

      document.body.removeChild(anchor)
    })

    it('calls onClose when Escape is pressed', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const handleClose = jest.fn()

      render(
        <Menu open anchorEl={anchor} onClose={handleClose}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
      expect(handleClose).toHaveBeenCalledTimes(1)

      document.body.removeChild(anchor)
    })
  })

  describe('Close behavior', () => {
    it('closes menu when item is clicked by default', async () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const handleClose = jest.fn()

      render(
        <Menu open anchorEl={anchor} onClose={handleClose}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      await userEvent.click(screen.getByRole('menuitem'))
      expect(handleClose).toHaveBeenCalledTimes(1)

      document.body.removeChild(anchor)
    })

    it('does not close menu when closeMenuOnClick is false', async () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)
      const handleClose = jest.fn()

      render(
        <Menu open anchorEl={anchor} onClose={handleClose}>
          <Menu.Item closeMenuOnClick={false}>Item</Menu.Item>
        </Menu>,
      )

      await userEvent.click(screen.getByRole('menuitem'))
      expect(handleClose).not.toHaveBeenCalled()

      document.body.removeChild(anchor)
    })
  })

  describe('Accessibility', () => {
    it('has menu role on container', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      expect(screen.getByRole('menu')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })

    it('has menuitem role on items', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>Item</Menu.Item>
        </Menu>,
      )

      expect(screen.getByRole('menuitem')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })

    it('has group role on sections', () => {
      const anchor = document.createElement('button')
      document.body.appendChild(anchor)

      render(
        <Menu open anchorEl={anchor}>
          <Menu.Section title="Group">
            <Menu.Item>Item</Menu.Item>
          </Menu.Section>
        </Menu>,
      )

      expect(screen.getByRole('group')).toBeInTheDocument()

      document.body.removeChild(anchor)
    })

    it('has no accessibility violations', async () => {
      const anchor = document.createElement('button')
      anchor.textContent = 'Open menu'
      document.body.appendChild(anchor)

      const { container } = render(
        <Menu open anchorEl={anchor}>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu>,
      )

      expect(await axe(container)).toHaveNoViolations()

      document.body.removeChild(anchor)
    })
  })
})
