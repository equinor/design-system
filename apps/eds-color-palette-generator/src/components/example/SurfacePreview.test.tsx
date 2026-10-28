// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { stepLabel } from '@/config/config'
import { calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import {
  DEFAULT_SURFACE,
  SURFACE_STEPS,
  SurfacePreview,
  SurfaceSelect,
} from './SurfacePreview'

const STEPS = tokensStudioPalettes('light')[1].steps

/** The contrast tile with this label, e.g. "Text / Card". */
function tile(label: string) {
  const element = screen.getByText(label).closest('.rounded')
  if (!(element instanceof HTMLElement)) throw new Error(`No tile ${label}`)
  return element
}

describe('SurfacePreview', () => {
  describe('Rendering', () => {
    it('labels each layer with its step', () => {
      render(<SurfacePreview config={DEFAULT_SURFACE} steps={STEPS} />)

      for (const [label, step] of [
        ['Page', DEFAULT_SURFACE.page],
        ['Panel', DEFAULT_SURFACE.panel],
        ['Card row', DEFAULT_SURFACE.cardRow],
      ] as const) {
        const layer = screen.getByText(label, { selector: 'strong' })
        expect(layer.parentElement).toHaveTextContent(
          `${label} ${stepLabel(step)}`,
        )
      }
    })

    it('renders three cards with a title and body text', () => {
      render(<SurfacePreview config={DEFAULT_SURFACE} steps={STEPS} />)

      expect(screen.getAllByText('Card title')).toHaveLength(3)
      expect(screen.getAllByText('Body text content')).toHaveLength(3)
    })

    it('shows the contrast between neighbouring layers', () => {
      render(<SurfacePreview config={DEFAULT_SURFACE} steps={STEPS} />)

      const step = (n: number) => STEPS[n - 1]
      const { page, panel, cardRow, card, border, text } = DEFAULT_SURFACE
      for (const [label, fg, bg] of [
        ['Page / Panel', panel, page],
        ['Panel / Card row', cardRow, panel],
        ['Card row / Card', card, cardRow],
        ['Border / Card', border, card],
        ['Text / Card', text, card],
      ] as const) {
        expect(tile(label)).toHaveTextContent(
          `${calcContrast(step(fg), step(bg)).wcag}:1`,
        )
      }
    })
  })
})

describe('SurfaceSelect', () => {
  describe('Rendering', () => {
    it('offers every step it is given and marks the recommended ones', () => {
      render(
        <SurfaceSelect
          label="Page"
          value={1}
          onChange={() => {}}
          options={SURFACE_STEPS}
          recommended={new Set([1])}
        />,
      )

      const options = within(screen.getByRole('combobox')).getAllByRole(
        'option',
      )
      expect(options.map((option) => option.getAttribute('value'))).toEqual(
        SURFACE_STEPS.map(String),
      )
      expect(options[0]).toHaveTextContent(`● ${stepLabel(SURFACE_STEPS[0])}`)
      expect(options[1]).not.toHaveTextContent('●')
    })
  })

  describe('Behaviour', () => {
    it('reports the chosen step as a number', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <SurfaceSelect
          label="Page"
          value={SURFACE_STEPS[0]}
          onChange={onChange}
          options={SURFACE_STEPS}
        />,
      )

      await user.selectOptions(
        screen.getByRole('combobox'),
        String(SURFACE_STEPS[1]),
      )

      expect(onChange).toHaveBeenCalledWith(SURFACE_STEPS[1])
    })
  })
})
