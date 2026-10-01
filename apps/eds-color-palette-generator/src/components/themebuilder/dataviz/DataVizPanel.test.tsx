// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DataVizPanel } from './DataVizPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import {
  DEFAULT_CATEGORICAL,
  DEFAULT_DIVERGING,
  DEFAULT_SEQUENTIAL,
} from '@/config/dataviz-defaults'
import { generateCategoricalPalette } from '@/utils/dataviz'
import { downloadText, toHexArray, toW3CTokens } from '@/utils/dataviz-export'

vi.mock('@/utils/dataviz-export', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/dataviz-export')>()),
  downloadText: vi.fn(),
}))

const DEFAULT_COLOURS = generateCategoricalPalette(
  { ...DEFAULT_CATEGORICAL, enforceCVD: true },
  'light',
)

const family = (name: string) =>
  within(screen.getByRole('radiogroup', { name: 'Palette family' })).getByRole(
    'radio',
    { name },
  )

describe('DataVizPanel', () => {
  beforeEach(() => {
    vi.mocked(downloadText).mockClear()
  })

  describe('Rendering', () => {
    it('starts on a categorical palette with its audit', () => {
      renderWithProviders(<DataVizPanel />)

      expect(family('Categorical')).toBeChecked()
      expect(screen.getAllByTestId('dataviz-swatch')).toHaveLength(
        DEFAULT_CATEGORICAL.count,
      )
      for (const colour of DEFAULT_COLOURS) {
        expect(screen.getAllByText(colour.hex).length).toBeGreaterThan(0)
      }
      expect(
        screen.getByRole('region', { name: 'Accessibility audit' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('region', { name: 'Data colour chart' }),
      ).toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('shows a sequential scale with its own controls', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataVizPanel />)

      await user.click(family('Sequential'))

      expect(screen.getAllByTestId('dataviz-swatch')).toHaveLength(
        DEFAULT_SEQUENTIAL.steps,
      )
      expect(screen.getByRole('combobox', { name: 'Hue' })).toBeInTheDocument()
      expect(
        screen.queryByRole('region', { name: 'Accessibility audit' }),
      ).not.toBeInTheDocument()
    })

    it('shows a diverging scale', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataVizPanel />)

      await user.click(family('Diverging'))

      expect(screen.getAllByTestId('dataviz-swatch')).toHaveLength(
        DEFAULT_DIVERGING.steps,
      )
    })

    it('copies the hex array', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataVizPanel />)

      await user.click(screen.getByRole('button', { name: 'Copy hex array' }))

      await expect(navigator.clipboard.readText()).resolves.toBe(
        toHexArray(DEFAULT_COLOURS),
      )
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    })

    it('downloads the palette as tokens', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataVizPanel />)

      await user.click(screen.getByRole('button', { name: 'Download tokens' }))

      expect(downloadText).toHaveBeenCalledWith(
        'dataviz-categorical-tokens.json',
        toW3CTokens(DEFAULT_COLOURS, 'categorical'),
        'application/json',
      )
    })
  })
})
