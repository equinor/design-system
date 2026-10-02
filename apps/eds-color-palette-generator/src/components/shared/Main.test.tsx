// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import {
  ColorSchemeProvider,
  useColorScheme,
} from '@/context/ColorSchemeContext'
import { DensityProvider, useDensity } from '@/context/DensityContext'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { Main } from './Main'

function Providers({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <DensityProvider>{children}</DensityProvider>
    </ColorSchemeProvider>
  )
}

function Switches() {
  const { setColorScheme } = useColorScheme()
  const { setDensity } = useDensity()
  return (
    <>
      <button onClick={() => setColorScheme('dark')}>Dark</button>
      <button onClick={() => setDensity('relaxed')}>Relaxed</button>
    </>
  )
}

describe('Main', () => {
  describe('Rendering', () => {
    it('renders a main landmark with its children', () => {
      render(
        <Providers>
          <Main>
            <h1>Theme Builder</h1>
          </Main>
        </Providers>,
      )

      expect(screen.getByRole('main')).toContainElement(
        screen.getByRole('heading', { name: 'Theme Builder' }),
      )
    })

    it('passes other props through to <main>', () => {
      render(
        <Providers>
          <Main id="content" className="p-6" aria-label="Palettes" />
        </Providers>,
      )

      const main = screen.getByRole('main', { name: 'Palettes' })
      expect(main).toHaveAttribute('id', 'content')
      expect(main).toHaveClass('p-6')
    })
  })

  describe('Behaviour', () => {
    it('sets the default density and scheme after mount', () => {
      render(
        <Providers>
          <Main />
        </Providers>,
      )

      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('data-density', 'comfortable')
      expect(main).toHaveAttribute('data-color-scheme', 'light')
    })

    it('sets the saved density and the page scheme after mount', () => {
      localStorage.setItem(STORAGE_KEYS.DENSITY, JSON.stringify('compact'))
      document.documentElement.setAttribute('data-color-scheme', 'dark')
      render(
        <Providers>
          <Main />
        </Providers>,
      )

      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('data-density', 'compact')
      expect(main).toHaveAttribute('data-color-scheme', 'dark')
    })

    it('follows changes to the scheme and density', async () => {
      const user = userEvent.setup()
      render(
        <Providers>
          <Switches />
          <Main />
        </Providers>,
      )

      await user.click(screen.getByRole('button', { name: 'Dark' }))
      await user.click(screen.getByRole('button', { name: 'Relaxed' }))

      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('data-color-scheme', 'dark')
      expect(main).toHaveAttribute('data-density', 'relaxed')
    })

    it('leaves both attributes out of the server render', () => {
      const html = renderToString(
        <Providers>
          <Main>Content</Main>
        </Providers>,
      )

      expect(html).toBe('<main>Content</main>')
    })
  })
})
