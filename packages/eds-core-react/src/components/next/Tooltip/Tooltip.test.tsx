import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Tooltip } from '.'

// jsdom does not implement the Popover API
const showPopoverMock = jest.fn(function (this: HTMLElement) {
  this.setAttribute('data-popover-open', '')
})
const hidePopoverMock = jest.fn(function (this: HTMLElement) {
  this.removeAttribute('data-popover-open')
})

beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopoverMock
  HTMLElement.prototype.hidePopover = hidePopoverMock
  HTMLElement.prototype.matches = function (
    this: HTMLElement,
    selector: string,
  ) {
    if (selector === ':popover-open')
      return this.hasAttribute('data-popover-open')
    return Element.prototype.matches.call(this, selector)
  }
})

afterEach(() => jest.clearAllMocks())

const trigger = <button>Hover me</button>

describe('Tooltip (next)', () => {
  describe('Rendering', () => {
    it('renders the trigger element', () => {
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      expect(
        screen.getByRole('button', { name: 'Hover me' }),
      ).toBeInTheDocument()
    })

    it('renders tooltip in the DOM when title is provided', () => {
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument()
    })

    it('does not render tooltip when title is not provided', () => {
      render(<Tooltip>{trigger}</Tooltip>)
      expect(
        screen.queryByRole('tooltip', { hidden: true }),
      ).not.toBeInTheDocument()
    })

    it('tooltip has popover="hint" attribute', () => {
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
        'popover',
        'hint',
      )
    })

    it('applies custom className to tooltip', () => {
      render(
        <Tooltip title="Tooltip text" className="custom">
          {trigger}
        </Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(
        'eds-tooltip',
        'custom',
      )
    })

    it('forwards ref to tooltip element', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(
        <Tooltip title="Tooltip text" ref={ref}>
          {trigger}
        </Tooltip>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('sets data-placement attribute on tooltip', () => {
      render(
        <Tooltip title="Tooltip text" placement="top">
          {trigger}
        </Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
        'data-placement',
        'top',
      )
    })

    it('adds aria-describedby on trigger pointing to tooltip id', () => {
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      const btn = screen.getByRole('button')
      const tooltip = screen.getByRole('tooltip', { hidden: true })
      expect(btn).toHaveAttribute('aria-describedby', tooltip.id)
    })
  })

  describe('Disabled state', () => {
    it('does not render tooltip when disabled', () => {
      render(
        <Tooltip title="Tooltip text" disabled>
          {trigger}
        </Tooltip>,
      )
      expect(
        screen.queryByRole('tooltip', { hidden: true }),
      ).not.toBeInTheDocument()
    })

    it('does not add aria-describedby when disabled', () => {
      render(
        <Tooltip title="Tooltip text" disabled>
          {trigger}
        </Tooltip>,
      )
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('Interaction', () => {
    it('calls showPopover on hover', async () => {
      const user = userEvent.setup()
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      await user.hover(screen.getByRole('button'))
      expect(showPopoverMock).toHaveBeenCalled()
    })

    it('schedules hidePopover on mouse leave', async () => {
      const user = userEvent.setup()
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      await user.hover(screen.getByRole('button'))
      await user.unhover(screen.getByRole('button'))
      await new Promise((r) => setTimeout(r, 150))
      expect(hidePopoverMock).toHaveBeenCalled()
    })

    it('calls showPopover on focus', async () => {
      const user = userEvent.setup()
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      await user.tab()
      expect(showPopoverMock).toHaveBeenCalled()
    })

    it('calls hidePopover on blur', async () => {
      const user = userEvent.setup()
      render(<Tooltip title="Tooltip text">{trigger}</Tooltip>)
      await user.tab()
      await user.tab()
      await new Promise((r) => setTimeout(r, 150))
      expect(hidePopoverMock).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Tooltip title="Tooltip text">{trigger}</Tooltip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
