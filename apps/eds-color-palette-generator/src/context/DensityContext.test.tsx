// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { DensityProvider, useDensity } from './DensityContext'

/** Shows the density and records every value it renders with. */
function Probe({ seen = [] }: { seen?: string[] }) {
  const { density, setDensity } = useDensity()
  seen.push(density)
  return (
    <>
      <output aria-label="Density">{density}</output>
      <button onClick={() => setDensity('compact')}>Compact</button>
    </>
  )
}

function renderProvider(seen?: string[]) {
  return render(
    <DensityProvider>
      <Probe seen={seen} />
    </DensityProvider>,
  )
}

const density = () => screen.getByLabelText('Density')
const saved = () => localStorage.getItem(STORAGE_KEYS.DENSITY)

describe('DensityProvider', () => {
  describe('Initial density', () => {
    it('defaults to comfortable', () => {
      renderProvider()

      expect(density()).toHaveTextContent('comfortable')
    })

    it('renders comfortable first and applies the saved density after mount', () => {
      localStorage.setItem(STORAGE_KEYS.DENSITY, JSON.stringify('relaxed'))
      const seen: string[] = []
      renderProvider(seen)

      expect(seen[0]).toBe('comfortable')
      expect(seen.at(-1)).toBe('relaxed')
      expect(density()).toHaveTextContent('relaxed')
    })

    it('does not save anything on mount', () => {
      renderProvider()

      expect(saved()).toBeNull()
    })

    it('falls back to comfortable when the saved value cannot be read', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorage.setItem(STORAGE_KEYS.DENSITY, 'not json')
      renderProvider()

      expect(density()).toHaveTextContent('comfortable')
      warn.mockRestore()
    })
  })

  describe('setDensity', () => {
    it('updates the density and saves it', async () => {
      const user = userEvent.setup()
      renderProvider()

      await user.click(screen.getByRole('button', { name: 'Compact' }))

      expect(density()).toHaveTextContent('compact')
      expect(saved()).toBe(JSON.stringify('compact'))
    })
  })
})

describe('useDensity', () => {
  it('throws outside a DensityProvider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Probe />)).toThrow(
      'useDensity must be used within a DensityProvider',
    )
    error.mockRestore()
  })
})
