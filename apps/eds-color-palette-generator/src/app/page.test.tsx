// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeBuilderPage from './page'
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'
import { DensityProvider } from '@/context/DensityContext'
import { TS_HUES } from '@/config/tokensStudio'
import { tokensStudioInputs } from '@/test/fixtures'
import { serializeState } from '@/utils/urlState'

const navigation = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => navigation.searchParams,
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}))

function renderPage() {
  return render(
    <ColorSchemeProvider>
      <DensityProvider>
        <ThemeBuilderPage />
      </DensityProvider>
    </ColorSchemeProvider>,
  )
}

const tab = (name: string) =>
  within(
    screen.getByRole('tablist', { name: 'Theme Builder views' }),
  ).getByRole('tab', { name })

describe('Theme Builder page', () => {
  beforeEach(() => {
    navigation.searchParams = new URLSearchParams()
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  describe('Rendering', () => {
    it('renders the heading and the three views', () => {
      renderPage()

      expect(
        screen.getByRole('heading', { level: 1, name: 'Theme Builder' }),
      ).toBeInTheDocument()
      for (const name of ['Colour system', 'Examples', 'Contrast']) {
        expect(tab(name)).toBeInTheDocument()
      }
      expect(tab('Colour system')).toHaveAttribute('aria-selected', 'true')
    })

    it('shows the Tokens Studio palettes in the colour system view', () => {
      renderPage()

      const panel = screen.getByRole('tabpanel', { name: 'Colour system' })
      for (const name of ['Palettes', 'Token matrix', 'Contrast table']) {
        expect(within(panel).getByRole('region', { name })).toBeInTheDocument()
      }
      TS_HUES.forEach((hue, i) => {
        expect(
          screen.getByRole('textbox', { name: `Name of palette ${i + 1}` }),
        ).toHaveValue(hue.name)
      })
    })

    it('opens the view named in the URL', () => {
      navigation.searchParams = new URLSearchParams('tab=contrast')
      renderPage()

      expect(tab('Contrast')).toHaveAttribute('aria-selected', 'true')
      expect(
        screen.getByRole('tablist', { name: 'Contrast checks' }),
      ).toBeInTheDocument()
    })

    it('reads the palettes from the URL', () => {
      navigation.searchParams = new URLSearchParams('p=Sunset:ff8800')
      renderPage()

      expect(
        screen.getByRole('textbox', { name: 'Name of palette 1' }),
      ).toHaveValue('Sunset')
      expect(
        screen.queryByRole('textbox', { name: 'Name of palette 2' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('switches to the examples and contrast views', async () => {
      const user = userEvent.setup()
      renderPage()

      await user.click(tab('Examples'))
      expect(
        screen.getByRole('region', { name: 'Palette roles' }),
      ).toBeInTheDocument()

      await user.click(tab('Contrast'))
      expect(
        screen.getByRole('tablist', { name: 'Contrast checks' }),
      ).toBeInTheDocument()
    })

    it('opens the download dialog from the Config button', async () => {
      const user = userEvent.setup()
      renderPage()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Config' }))

      expect(
        screen.getByRole('dialog', { name: 'Download' }),
      ).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('copies a link to the palettes with Share', async () => {
      const user = userEvent.setup()
      const writeText = vi.spyOn(navigator.clipboard, 'writeText')
      renderPage()

      await user.click(screen.getByRole('button', { name: 'Share' }))

      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/?${serializeState({ palettes: tokensStudioInputs() })}`,
      )
      expect(
        await screen.findByRole('button', { name: 'Copied' }),
      ).toBeInTheDocument()
    })

    it('copies a change made just before Share, before the address bar is updated', async () => {
      const user = userEvent.setup()
      const writeText = vi.spyOn(navigator.clipboard, 'writeText')
      renderPage()
      const [first, ...rest] = tokensStudioInputs()

      const name = screen.getByRole('textbox', { name: 'Name of palette 1' })
      await user.clear(name)
      await user.type(name, 'Sunset')
      await user.click(tab('Contrast'))
      await user.click(screen.getByRole('button', { name: 'Share' }))

      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/?${serializeState({
          palettes: [{ ...first, name: 'Sunset' }, ...rest],
          activeTab: 'contrast',
        })}`,
      )
    })
  })

  describe('Palette names', () => {
    it('renders every view without duplicate keys when two palettes share a name', async () => {
      const user = userEvent.setup()
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      navigation.searchParams = new URLSearchParams(
        'p=Sunset:ff8800,Sunset:ff8800,Gray:808080',
      )
      renderPage()

      await user.click(tab('Examples'))
      await user.click(tab('Contrast'))
      await user.click(
        within(
          screen.getByRole('tablist', { name: 'Contrast checks' }),
        ).getByRole('tab', { name: 'Custom' }),
      )

      const keyWarnings = consoleError.mock.calls.filter((args) =>
        String(args[0]).includes('same key'),
      )
      expect(keyWarnings).toEqual([])
      expect(screen.getAllByText('Sunset').length).toBeGreaterThan(1)
    })
  })

  describe('Timers', () => {
    beforeEach(() => {
      // Advancing with real time lets Testing Library's own setTimeout(0)
      // waits finish; its fake timer support only recognises Jest.
      vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout'],
        shouldAdvanceTime: true,
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('leaves no timer running after unmount', async () => {
      const user = userEvent.setup()
      const { unmount } = renderPage()

      await user.click(screen.getByRole('button', { name: 'Share' }))
      expect(
        await screen.findByRole('button', { name: 'Copied' }),
      ).toBeInTheDocument()
      // The "Copied" reset is pending, and the address bar update may be
      expect(vi.getTimerCount()).toBeGreaterThan(0)

      unmount()

      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
