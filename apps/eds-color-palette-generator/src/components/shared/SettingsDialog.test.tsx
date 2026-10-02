// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'
import { DensityProvider, useDensity } from '@/context/DensityContext'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { SettingsDialog } from './SettingsDialog'

function DensityProbe() {
  const { density } = useDensity()
  return <output aria-label="Current density">{density}</output>
}

function renderSettings({ open = true } = {}) {
  const onClose = vi.fn()
  const utils = render(
    <ColorSchemeProvider>
      <DensityProvider>
        <SettingsDialog open={open} onClose={onClose} />
        <DensityProbe />
      </DensityProvider>
    </ColorSchemeProvider>,
  )
  return { ...utils, onClose }
}

const saved = (key: string) => {
  const value = localStorage.getItem(key)
  return value === null ? null : JSON.parse(value)
}

describe('SettingsDialog', () => {
  describe('Rendering', () => {
    it('opens as a dialog named Settings', () => {
      renderSettings()

      expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible()
    })

    it('is not shown when closed', () => {
      renderSettings({ open: false })

      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('has a Theme group and a Density group', () => {
      renderSettings()

      expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeVisible()
      expect(screen.getByRole('radiogroup', { name: 'Density' })).toBeVisible()
      expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual([
        'Light',
        'Dark',
        'Relaxed',
        'Comfortable',
        'Compact',
      ])
    })
  })

  describe('Theme', () => {
    it('shows the scheme already on the page as chosen', () => {
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      renderSettings()

      expect(screen.getByRole('radio', { name: 'Dark theme' })).toBeChecked()
      expect(
        screen.getByRole('radio', { name: 'Light theme' }),
      ).not.toBeChecked()
    })

    it('switches to dark and saves the choice', async () => {
      const user = userEvent.setup()
      renderSettings()
      expect(screen.getByRole('radio', { name: 'Light theme' })).toBeChecked()

      await user.click(screen.getByRole('radio', { name: 'Dark theme' }))

      expect(screen.getByRole('radio', { name: 'Dark theme' })).toBeChecked()
      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'dark',
      )
      expect(saved(STORAGE_KEYS.COLOR_SCHEME)).toBe('dark')
    })

    it('switches back to light and saves the choice', async () => {
      const user = userEvent.setup()
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      renderSettings()

      await user.click(screen.getByRole('radio', { name: 'Light theme' }))

      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'light',
      )
      expect(saved(STORAGE_KEYS.COLOR_SCHEME)).toBe('light')
    })

    it('does not save a scheme until one is chosen', () => {
      renderSettings()

      expect(saved(STORAGE_KEYS.COLOR_SCHEME)).toBeNull()
    })
  })

  describe('Density', () => {
    it('starts on Comfortable, the Tokens Studio default', () => {
      renderSettings()

      expect(screen.getByRole('radio', { name: 'Comfortable' })).toBeChecked()
    })

    it('shows the saved density as chosen', () => {
      localStorage.setItem(STORAGE_KEYS.DENSITY, JSON.stringify('relaxed'))
      renderSettings()

      expect(screen.getByRole('radio', { name: 'Relaxed' })).toBeChecked()
    })

    it('updates the density and saves it', async () => {
      const user = userEvent.setup()
      renderSettings()

      await user.click(screen.getByRole('radio', { name: 'Compact' }))

      expect(screen.getByRole('radio', { name: 'Compact' })).toBeChecked()
      expect(screen.getByLabelText('Current density')).toHaveTextContent(
        'compact',
      )
      expect(saved(STORAGE_KEYS.DENSITY)).toBe('compact')
    })

    it('changes density with the arrow keys', async () => {
      const user = userEvent.setup()
      renderSettings()
      await user.click(screen.getByRole('radio', { name: 'Comfortable' }))

      await user.keyboard('{ArrowRight}')

      expect(screen.getByRole('radio', { name: 'Compact' })).toHaveFocus()
      expect(screen.getByLabelText('Current density')).toHaveTextContent(
        'compact',
      )
    })
  })

  describe('Closing', () => {
    it('calls onClose from Done', async () => {
      const user = userEvent.setup()
      const { onClose } = renderSettings()

      await user.click(screen.getByRole('button', { name: 'Done' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose from the close button', async () => {
      const user = userEvent.setup()
      const { onClose } = renderSettings()

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
