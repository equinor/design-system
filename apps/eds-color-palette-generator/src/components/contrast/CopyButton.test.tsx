// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { CopyButton } from './CopyButton'

const HEX = tokensStudioPalettes('light')[0].steps[8]

/**
 * userEvent.setup() puts its own clipboard on navigator, so the stub goes on
 * after it.
 */
function setup({ fakeTimers = false } = {}) {
  const user = userEvent.setup(
    fakeTimers ? { advanceTimers: vi.advanceTimersByTime } : {},
  )
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined)
  return { user, writeText }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('CopyButton', () => {
  describe('Rendering', () => {
    it('renders a button that names the value it copies', () => {
      render(<CopyButton text={HEX} />)

      const button = screen.getByRole('button', { name: 'Copy' })
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute('title', `Copy ${HEX}`)
    })
  })

  describe('Behaviour', () => {
    it('copies the value to the clipboard', async () => {
      const { user, writeText } = setup()
      render(<CopyButton text={HEX} />)

      await user.click(screen.getByRole('button', { name: 'Copy' }))

      expect(writeText).toHaveBeenCalledWith(HEX)
      expect(
        screen.getByRole('button', { name: 'Copied!' }),
      ).toBeInTheDocument()
    })

    it('goes back to Copy after a moment', async () => {
      // shouldAdvanceTime lets Testing Library's own zero-delay timeouts run
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const { user } = setup({ fakeTimers: true })
      render(<CopyButton text={HEX} />)

      await user.click(screen.getByRole('button', { name: 'Copy' }))
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(
        screen.getByRole('button', { name: 'Copied!' }),
      ).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })

    it('stays on Copy when the clipboard refuses', async () => {
      const { user, writeText } = setup()
      writeText.mockRejectedValue(new Error('Denied'))
      render(<CopyButton text={HEX} />)

      await user.click(screen.getByRole('button', { name: 'Copy' }))

      expect(writeText).toHaveBeenCalledWith(HEX)
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('hides the icon from assistive technology', () => {
      render(<CopyButton text={HEX} />)

      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
