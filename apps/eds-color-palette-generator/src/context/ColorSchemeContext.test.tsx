// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { ColorSchemeProvider, useColorScheme } from './ColorSchemeContext'

type Listener = (event: MediaQueryListEvent) => void

/** A matchMedia stand-in whose `change` listeners the test can fire. */
function stubMatchMedia() {
  const listeners = new Set<Listener>()
  const query = {
    matches: false,
    addEventListener: vi.fn((_type: string, listener: Listener) => {
      listeners.add(listener)
    }),
    removeEventListener: vi.fn((_type: string, listener: Listener) => {
      listeners.delete(listener)
    }),
  }
  const matchMedia = vi.fn(() => query)
  vi.stubGlobal('matchMedia', matchMedia)
  return {
    matchMedia,
    listeners,
    /** The system switches to dark (`true`) or light (`false`). */
    systemChange(matches: boolean) {
      act(() => {
        for (const listener of listeners) {
          listener({ matches } as MediaQueryListEvent)
        }
      })
    },
  }
}

let media: ReturnType<typeof stubMatchMedia>

beforeEach(() => {
  media = stubMatchMedia()
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('data-color-scheme')
})

/** Shows the scheme and records every value it renders with. */
function Probe({ seen = [] }: { seen?: string[] }) {
  const { colorScheme, setColorScheme } = useColorScheme()
  seen.push(colorScheme)
  return (
    <>
      <output aria-label="Scheme">{colorScheme}</output>
      <button onClick={() => setColorScheme('dark')}>Dark</button>
      <button onClick={() => setColorScheme('light')}>Light</button>
    </>
  )
}

function renderProvider(seen?: string[]) {
  return render(
    <ColorSchemeProvider>
      <Probe seen={seen} />
    </ColorSchemeProvider>,
  )
}

const scheme = () => screen.getByLabelText('Scheme')
const saved = () => localStorage.getItem(STORAGE_KEYS.COLOR_SCHEME)

describe('ColorSchemeProvider', () => {
  describe('Initial scheme', () => {
    it('renders light first, so the server and client renders match', () => {
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      const seen: string[] = []
      renderProvider(seen)

      expect(seen[0]).toBe('light')
    })

    it('adopts the scheme the pre-paint script set on <html> after mount', () => {
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      const seen: string[] = []
      renderProvider(seen)

      expect(seen.at(-1)).toBe('dark')
      expect(scheme()).toHaveTextContent('dark')
    })

    it('stays light when <html> has no scheme', () => {
      renderProvider()
      expect(scheme()).toHaveTextContent('light')
    })

    it('treats an unknown scheme on <html> as light', () => {
      document.documentElement.setAttribute('data-color-scheme', 'sepia')
      renderProvider()

      expect(scheme()).toHaveTextContent('light')
    })

    it('does not save anything on mount', () => {
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      renderProvider()

      expect(saved()).toBeNull()
    })

    it('leaves a saved choice as it was on mount', () => {
      localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, JSON.stringify('dark'))
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      renderProvider()

      expect(saved()).toBe(JSON.stringify('dark'))
    })
  })

  describe('setColorScheme', () => {
    it('updates the scheme, sets it on <html> and saves it', async () => {
      const user = userEvent.setup()
      renderProvider()

      await user.click(screen.getByRole('button', { name: 'Dark' }))

      expect(scheme()).toHaveTextContent('dark')
      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'dark',
      )
      expect(saved()).toBe(JSON.stringify('dark'))
    })

    it('saves light as an explicit choice too', async () => {
      const user = userEvent.setup()
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      renderProvider()

      await user.click(screen.getByRole('button', { name: 'Light' }))

      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'light',
      )
      expect(saved()).toBe(JSON.stringify('light'))
    })
  })

  describe('System preference', () => {
    it('listens to prefers-color-scheme', () => {
      renderProvider()

      expect(media.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)',
      )
      expect(media.listeners.size).toBe(1)
    })

    it('follows a system change while nothing is saved, without saving it', () => {
      renderProvider()

      media.systemChange(true)
      expect(scheme()).toHaveTextContent('dark')
      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'dark',
      )

      media.systemChange(false)
      expect(scheme()).toHaveTextContent('light')
      expect(saved()).toBeNull()
    })

    it('ignores a system change once the user has chosen a scheme', async () => {
      const user = userEvent.setup()
      renderProvider()
      await user.click(screen.getByRole('button', { name: 'Light' }))

      media.systemChange(true)

      expect(scheme()).toHaveTextContent('light')
      expect(document.documentElement).toHaveAttribute(
        'data-color-scheme',
        'light',
      )
    })

    it('stops listening on unmount', () => {
      const { unmount } = renderProvider()

      unmount()

      expect(media.listeners.size).toBe(0)
    })
  })
})

describe('useColorScheme', () => {
  it('throws outside a ColorSchemeProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Probe />)).toThrow(
      'useColorScheme must be used within a ColorSchemeProvider',
    )

    vi.mocked(console.error).mockRestore()
  })
})
