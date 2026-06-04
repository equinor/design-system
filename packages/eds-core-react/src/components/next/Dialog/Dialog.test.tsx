import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Dialog } from '.'
import { Button } from '../Button'

// JSDOM doesn't implement HTMLDialogElement.showModal / .close — patch them
// onto the prototype so the useEffect open/close sync can be observed via the
// DOM. Safe to overwrite unconditionally in the test environment.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

const renderOpen = (onOpenChange: (open: boolean) => void = () => {}) =>
  render(
    <Dialog open onOpenChange={onOpenChange}>
      <Dialog.Header closable>
        <Dialog.Title>Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>Content</Dialog.Content>
      <Dialog.Actions>
        <Button>OK</Button>
      </Dialog.Actions>
    </Dialog>,
  )

describe('Dialog (next)', () => {
  describe('Rendering', () => {
    it('renders title, content and actions', () => {
      renderOpen()
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    })

    it('renders a <dialog> element with the eds-dialog class', () => {
      renderOpen()
      const dialog = screen.getByRole('dialog')
      expect(dialog.tagName).toBe('DIALOG')
      expect(dialog).toHaveClass('eds-dialog')
    })

    it('forwards ref to the dialog element', () => {
      const ref = { current: null as HTMLDialogElement | null }
      render(
        <Dialog open ref={ref} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDialogElement)
    })

    it('renders Dialog.Actions children inside an action row', () => {
      render(
        <Dialog open aria-label="d">
          <Dialog.Actions>
            <Button>Confirm</Button>
          </Dialog.Actions>
        </Dialog>,
      )
      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument()
    })

    it('applies an inline width override via style', () => {
      render(
        <Dialog open style={{ inlineSize: '32rem' }} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toHaveStyle({ inlineSize: '32rem' })
    })

    it('sets data-scrim by default', () => {
      renderOpen()
      expect(screen.getByRole('dialog')).toHaveAttribute('data-scrim')
    })

    it('omits data-scrim when scrim is false', () => {
      render(
        <Dialog open scrim={false} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).not.toHaveAttribute('data-scrim')
    })

    it('omits the close button when closable is not set', () => {
      render(
        <Dialog open aria-label="d">
          <Dialog.Header>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Header>
        </Dialog>,
      )
      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Open state', () => {
    it('opens via showModal when initial open is true', () => {
      render(
        <Dialog open aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute('open')
    })

    it('opens when the open prop becomes true', () => {
      const { rerender } = render(
        <Dialog open={false} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      )

      rerender(
        <Dialog open aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute('open')
    })

    it('closes when the open prop becomes false', () => {
      const { rerender } = render(
        <Dialog open aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute('open')

      rerender(
        <Dialog open={false} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      )
    })
  })

  describe('Closing', () => {
    it('invokes onOpenChange(false) when the close button is clicked', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()
      renderOpen(onOpenChange)
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('invokes onOpenChange(false) on backdrop click', () => {
      const onOpenChange = jest.fn()
      renderOpen(onOpenChange)
      // A click whose target IS the dialog element comes from the backdrop.
      // Both mousedown and click must land on the dialog itself — guards
      // against drag-out from a text selection.
      const dialog = screen.getByRole('dialog')
      fireEvent.mouseDown(dialog)
      fireEvent.click(dialog)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('does not close when mousedown started on a child and ended on the dialog', () => {
      const onOpenChange = jest.fn()
      renderOpen(onOpenChange)
      const dialog = screen.getByRole('dialog')
      // mousedown on a child (text-selection drag start), released over the
      // dialog itself. Without the mousedown-target guard this would close.
      fireEvent.mouseDown(screen.getByText('Content'))
      fireEvent.click(dialog)
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it('does not invoke onOpenChange when clicking dialog children', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()
      renderOpen(onOpenChange)
      await user.click(screen.getByText('Content'))
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it('fires onOpenChange exactly once on backdrop click', () => {
      const onOpenChange = jest.fn()
      const Controlled = () => {
        const [open, setOpen] = useState(true)
        return (
          <Dialog
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
            aria-label="d"
          >
            <Dialog.Content>x</Dialog.Content>
          </Dialog>
        )
      }
      render(<Controlled />)
      const dialog = screen.getByRole('dialog', { hidden: true })
      fireEvent.mouseDown(dialog)
      fireEvent.click(dialog)
      expect(onOpenChange).toHaveBeenCalledTimes(1)
    })

    it('fires onOpenChange exactly once on close-button click', async () => {
      const user = userEvent.setup()
      const onOpenChange = jest.fn()
      const Controlled = () => {
        const [open, setOpen] = useState(true)
        return (
          <Dialog
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
          >
            <Dialog.Header closable>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Header>
          </Dialog>
        )
      }
      render(<Controlled />)
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(onOpenChange).toHaveBeenCalledTimes(1)
    })

    it('fires onOpenChange exactly once when consumer flips open to false', () => {
      const onOpenChange = jest.fn()
      const { rerender } = render(
        <Dialog open onOpenChange={onOpenChange} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      rerender(
        <Dialog open={false} onOpenChange={onOpenChange} aria-label="d">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      // The effect-driven close should suppress the close-event callback so
      // a state-driven close doesn't loop back into onOpenChange.
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it('invokes onOpenChange(false) on the native close event', () => {
      const onOpenChange = jest.fn()
      const Controlled = () => {
        const [open, setOpen] = useState(true)
        return (
          <Dialog
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
            aria-label="d"
          >
            <Dialog.Content>x</Dialog.Content>
          </Dialog>
        )
      }
      render(<Controlled />)
      const dialog = screen.getByRole('dialog')
      // ESC triggers the dialog's close() in browsers; simulate by firing
      // the close event directly (our patched close() does the same).
      fireEvent(dialog, new Event('close'))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Accessibility', () => {
    it('has no violations when open with aria-labelledby', async () => {
      const { container } = renderOpen()
      expect(await axe(container)).toHaveNoViolations()
    })

    it('exposes the title as an h2 heading', () => {
      renderOpen()
      expect(
        screen.getByRole('heading', { level: 2, name: 'Title' }),
      ).toBeInTheDocument()
    })

    it('auto-wires aria-labelledby to Dialog.Title', () => {
      renderOpen()
      const dialog = screen.getByRole('dialog')
      const heading = screen.getByRole('heading', { name: 'Title' })
      expect(dialog).toHaveAttribute('aria-labelledby', heading.id)
      expect(heading.id).toBeTruthy()
    })

    it('respects an explicit aria-labelledby on Dialog', () => {
      render(
        <Dialog open aria-labelledby="explicit-id">
          <Dialog.Header>
            <Dialog.Title id="explicit-id">Title</Dialog.Title>
          </Dialog.Header>
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-labelledby',
        'explicit-id',
      )
    })

    it('uses aria-label without setting aria-labelledby', () => {
      render(
        <Dialog open aria-label="Confirmation">
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-label', 'Confirmation')
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })

    it('omits aria-labelledby when no title and no aria-label is given', () => {
      render(
        <Dialog open>
          <Dialog.Content>x</Dialog.Content>
        </Dialog>,
      )
      // Without a Dialog.Title or aria-label, defaulting aria-labelledby to
      // an unregistered id would dangle. The title id is only used if a
      // Dialog.Title has actually registered.
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
    })
  })
})
