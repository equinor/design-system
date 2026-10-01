// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ComponentPreviewPanel } from './ComponentPreviewPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_TONE_HUE, hueDisplayName } from '@/config/tokensStudio'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light')
const ACCENT = hueDisplayName(TS_TONE_HUE.light.accent)
const NEUTRAL = hueDisplayName(TS_TONE_HUE.light.neutral)

const roles = () => screen.getByRole('region', { name: 'Palette roles' })
const accentSelect = () => within(roles()).getByRole('combobox')
const dataColours = () =>
  within(roles()).getByText('Data colours:').parentElement as HTMLElement

describe('ComponentPreviewPanel', () => {
  describe('Rendering', () => {
    it('renders the role picker and every preview', () => {
      renderWithProviders(<ComponentPreviewPanel palettes={PALETTES} />)

      for (const name of [
        'Palette roles',
        'Buttons',
        'Login form',
        'Data table',
        'Article cards',
      ]) {
        expect(screen.getByRole('region', { name })).toBeInTheDocument()
      }
    })

    it('uses the Tokens Studio neutral and accent palettes by default', () => {
      renderWithProviders(<ComponentPreviewPanel palettes={PALETTES} />)

      // The select lists every palette too, so look for the neutral chip
      expect(
        within(roles()).getByText(NEUTRAL, { selector: 'span' }),
      ).toBeInTheDocument()
      expect(accentSelect()).toHaveDisplayValue(ACCENT)
      const others = within(dataColours())
      expect(others.queryByText(ACCENT)).not.toBeInTheDocument()
      expect(others.queryByText(NEUTRAL)).not.toBeInTheDocument()
      for (const p of PALETTES) {
        if (p.name === ACCENT || p.name === NEUTRAL) continue
        expect(others.getByText(p.name)).toBeInTheDocument()
      }
    })

    it('falls back to the Tokens Studio neutral when no palette has its name', () => {
      const renamed = PALETTES.map((p, i) => ({ ...p, name: `Palette ${i}` }))
      renderWithProviders(<ComponentPreviewPanel palettes={renamed} />)

      expect(
        within(roles()).getByText(`${NEUTRAL} (Tokens Studio default)`),
      ).toBeInTheDocument()
    })

    it('renders nothing without palettes', () => {
      const { container } = renderWithProviders(
        <ComponentPreviewPanel palettes={[]} />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('Behaviour', () => {
    it('moves the previous accent to the data colours when another is chosen', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ComponentPreviewPanel palettes={PALETTES} />)
      const next = PALETTES.find((p) => p.name !== ACCENT && p.name !== NEUTRAL)
      if (!next) throw new Error('Expected a third palette')

      await user.selectOptions(accentSelect(), next.name)

      expect(accentSelect()).toHaveDisplayValue(next.name)
      expect(within(dataColours()).getByText(ACCENT)).toBeInTheDocument()
      expect(
        within(dataColours()).queryByText(next.name),
      ).not.toBeInTheDocument()
    })
  })
})
