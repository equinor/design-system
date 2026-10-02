// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { stepLabel } from '@/config/config'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { DEFAULT_SURFACE, TEXT_STEPS } from './SurfacePreview'
import { SurfacePreviewSection } from './SurfacePreviewSection'

const PALETTES = tokensStudioPalettes('light').slice(0, 2)

const section = () => screen.getByRole('region', { name: 'Surface preview' })
const select = (label: string) =>
  within(section()).getByLabelText(label, { selector: 'select' })

describe('SurfacePreviewSection', () => {
  describe('Rendering', () => {
    it('renders one preview per palette, under its name', () => {
      render(<SurfacePreviewSection allPalettes={PALETTES} />)

      for (const palette of PALETTES) {
        expect(within(section()).getByText(palette.name)).toBeInTheDocument()
      }
      expect(within(section()).getAllByText('Card title')).toHaveLength(
        PALETTES.length * 3,
      )
    })

    it('starts every layer select at the default step', () => {
      render(<SurfacePreviewSection allPalettes={PALETTES} />)

      expect(select('Page')).toHaveValue(String(DEFAULT_SURFACE.page))
      expect(select('Panel')).toHaveValue(String(DEFAULT_SURFACE.panel))
      expect(select('Card row')).toHaveValue(String(DEFAULT_SURFACE.cardRow))
      expect(select('Card')).toHaveValue(String(DEFAULT_SURFACE.card))
      expect(select('Border')).toHaveValue(String(DEFAULT_SURFACE.border))
      expect(select('Text')).toHaveValue(String(DEFAULT_SURFACE.text))
    })
  })

  describe('Behaviour', () => {
    it('changes a layer in every preview and resets to the defaults', async () => {
      const user = userEvent.setup()
      render(<SurfacePreviewSection allPalettes={PALETTES} />)
      const other = TEXT_STEPS.find((step) => step !== DEFAULT_SURFACE.text)
      if (other === undefined) throw new Error('Only one text step')

      await user.selectOptions(select('Text'), String(other))

      expect(select('Text')).toHaveValue(String(other))
      const textColours = (palette: (typeof PALETTES)[number]) =>
        palette.steps[other - 1]
      const titles = within(section()).getAllByText('Card title')
      expect(titles[0].style.color).not.toBe('')
      expect(titles[0]).toHaveStyle({ color: textColours(PALETTES[0]) })
      expect(titles[3]).toHaveStyle({ color: textColours(PALETTES[1]) })

      await user.click(within(section()).getByRole('button', { name: 'Reset' }))

      expect(select('Text')).toHaveValue(String(DEFAULT_SURFACE.text))
      expect(within(section()).getAllByText('Card title')[0]).toHaveStyle({
        color: PALETTES[0].steps[DEFAULT_SURFACE.text - 1],
      })
    })

    it('labels the options with the step names', () => {
      render(<SurfacePreviewSection allPalettes={PALETTES} />)

      expect(
        within(select('Text')).getByRole('option', {
          name: `● ${stepLabel(DEFAULT_SURFACE.text)}`,
        }),
      ).toBeInTheDocument()
    })
  })
})
