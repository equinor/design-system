// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataTablePreview } from './DataTablePreview'
import { resolveSemanticColors, toneRamps } from '@/utils/semanticTokens'

const COLORS = resolveSemanticColors(toneRamps('light'), 'light')

// The rows are plain divs; the status text identifies the Pending row.
const pendingRow = () =>
  screen.getByText('Pending').closest('[data-row]') as HTMLElement

describe('DataTablePreview', () => {
  describe('Rendering', () => {
    it('renders five rows with status colours from the status tones', () => {
      render(<DataTablePreview colors={COLORS} />)

      expect(screen.getAllByText('Hywind Scotland')).toHaveLength(5)
      expect(screen.getByText('Pending')).toHaveStyle({
        color: COLORS['text.on-default.warning'],
      })
      expect(screen.getByText('Offline')).toHaveStyle({
        color: COLORS['text.on-default.danger'],
      })
    })
  })

  describe('Behaviour', () => {
    it('selects a row on click and clears it on a second click', async () => {
      const user = userEvent.setup()
      render(<DataTablePreview colors={COLORS} />)
      expect(pendingRow()).not.toHaveAttribute('data-active')

      await user.click(screen.getByText('Pending'))
      expect(pendingRow()).toHaveAttribute('data-active')

      await user.click(screen.getByText('Pending'))
      expect(pendingRow()).not.toHaveAttribute('data-active')
    })
  })
})
