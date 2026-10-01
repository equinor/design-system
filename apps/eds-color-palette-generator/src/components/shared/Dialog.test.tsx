// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Dialog } from './Dialog'

function renderDialog(props: Partial<Parameters<typeof Dialog>[0]> = {}) {
  const onClose = vi.fn()
  const utils = render(
    <Dialog open onClose={onClose} title="Export" {...props}>
      <p>Pick a file format.</p>
    </Dialog>,
  )
  return { ...utils, onClose }
}

describe('Dialog', () => {
  describe('Rendering', () => {
    it('opens as a modal when open is true', () => {
      renderDialog()

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('dialog')).toBeVisible()
      expect(screen.getByText('Pick a file format.')).toBeVisible()
    })

    it('stays closed when open is false', () => {
      renderDialog({ open: false })

      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('opens and closes when the open prop changes', () => {
      const { rerender, onClose } = renderDialog({ open: false })

      rerender(
        <Dialog open onClose={onClose} title="Export">
          Content
        </Dialog>,
      )
      expect(screen.getByRole('dialog')).toBeVisible()

      rerender(
        <Dialog open={false} onClose={onClose} title="Export">
          Content
        </Dialog>,
      )
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('renders the title as a level 2 heading', () => {
      renderDialog()

      expect(
        screen.getByRole('heading', { level: 2, name: 'Export' }),
      ).toBeInTheDocument()
    })

    it('renders the actions', () => {
      renderDialog({
        actions: (
          <>
            <Button>Cancel</Button>
            <Button variant="primary">Download</Button>
          </>
        ),
      })

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Download' })).toBeVisible()
    })

    it('adds its className to the dialog', () => {
      renderDialog({ className: 'w-[720px]' })

      expect(screen.getByRole('dialog')).toHaveClass('w-[720px]')
    })
  })

  describe('Accessibility', () => {
    it('is labelled by its title', () => {
      renderDialog({ title: 'Palette settings' })

      expect(
        screen.getByRole('dialog', { name: 'Palette settings' }),
      ).toBeInTheDocument()
    })

    it('has a close button named Close', () => {
      renderDialog()

      expect(screen.getByRole('button', { name: 'Close' })).toBeVisible()
    })
  })

  describe('Behaviour', () => {
    it('calls onClose from the close button', async () => {
      const user = userEvent.setup()
      const { onClose } = renderDialog()

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose on a click on the backdrop', async () => {
      const user = userEvent.setup()
      const { onClose } = renderDialog()

      // A click outside the content lands on the <dialog> element itself
      await user.click(screen.getByRole('dialog'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose on a click inside the content', async () => {
      const user = userEvent.setup()
      const { onClose } = renderDialog()

      await user.click(screen.getByText('Pick a file format.'))
      await user.click(screen.getByRole('heading', { name: 'Export' }))

      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose on the close event that Escape fires', () => {
      const { onClose } = renderDialog()

      act(() => {
        screen.getByRole('dialog').dispatchEvent(new Event('close'))
      })

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
