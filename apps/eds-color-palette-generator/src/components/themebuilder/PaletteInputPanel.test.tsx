// @vitest-environment jsdom
import { useState } from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaletteInputPanel } from './PaletteInputPanel'
import { tokensStudioInputs } from '@/test/fixtures'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_HUES } from '@/config/tokensStudio'
import { colourInFormat } from '@/context/ColorFormatContext'
import { toOklchString } from '@/utils/color'
import type { PaletteInput } from '@/utils/urlState'

/** The panel with its palettes in state, as the Theme Builder holds them. */
function Harness({
  initial,
  onChange,
}: {
  initial: PaletteInput[]
  onChange: (palettes: PaletteInput[]) => void
}) {
  const [palettes, setPalettes] = useState(initial)
  return (
    <PaletteInputPanel
      palettes={palettes}
      onChange={(next) => {
        onChange(next)
        setPalettes(next)
      }}
    />
  )
}

function renderPanel(initial: PaletteInput[] = tokensStudioInputs()) {
  const onChange = vi.fn<(palettes: PaletteInput[]) => void>()
  renderWithProviders(<Harness initial={initial} onChange={onChange} />)
  return { onChange, initial }
}

/** The palettes passed to the last onChange call. */
function lastPalettes(onChange: ReturnType<typeof renderPanel>['onChange']) {
  const calls = onChange.mock.calls
  return calls[calls.length - 1][0]
}

const colourField = (name: string) =>
  screen.getByRole('textbox', { name: `${name} colour value` })

const formatRadio = (name: 'OKLCH' | 'HEX') =>
  within(screen.getByRole('radiogroup', { name: 'Colour format' })).getByRole(
    'radio',
    { name },
  )

describe('PaletteInputPanel', () => {
  describe('Rendering', () => {
    it('renders a name field and a colour field per palette', () => {
      renderPanel()

      TS_HUES.forEach((hue, i) => {
        expect(
          screen.getByRole('textbox', { name: `Name of palette ${i + 1}` }),
        ).toHaveValue(hue.name)
        expect(colourField(hue.name)).toHaveValue(hue.anchor)
      })
    })

    it('disables removing the last palette', () => {
      renderPanel(tokensStudioInputs().slice(0, 1))

      expect(
        screen.getByRole('button', { name: `Remove ${TS_HUES[0].name}` }),
      ).toBeDisabled()
    })
  })

  describe('Colour format', () => {
    it('starts on OKLCH', () => {
      renderPanel()

      expect(formatRadio('OKLCH')).toBeChecked()
      expect(formatRadio('HEX')).not.toBeChecked()
    })

    it('shows the values as hex after switching to HEX', async () => {
      const user = userEvent.setup()
      renderPanel()

      await user.click(formatRadio('HEX'))

      expect(formatRadio('HEX')).toBeChecked()
      for (const hue of TS_HUES) {
        expect(colourField(hue.name)).toHaveValue(
          colourInFormat(hue.anchor, 'HEX'),
        )
      }
    })

    it('stores a hex value typed in HEX mode as OKLCH', async () => {
      const user = userEvent.setup()
      const { onChange } = renderPanel()
      const name = TS_HUES[0].name
      await user.click(formatRadio('HEX'))

      await user.clear(colourField(name))
      await user.paste('#ff0000')

      expect(onChange).toHaveBeenCalledTimes(1)
      const [first] = lastPalettes(onChange)
      expect(first.baseColor).toBe(toOklchString('#ff0000'))
    })

    it('marks an invalid value and does not store it', async () => {
      const user = userEvent.setup()
      const { onChange } = renderPanel()
      const field = colourField(TS_HUES[0].name)

      await user.clear(field)
      await user.paste('not a colour')

      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(field).toHaveValue('not a colour')
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Palettes', () => {
    it('renames a palette', async () => {
      const user = userEvent.setup()
      const { onChange, initial } = renderPanel()
      const nameField = screen.getByRole('textbox', {
        name: 'Name of palette 2',
      })

      await user.clear(nameField)
      await user.type(nameField, 'Sunset Orange')

      const next = lastPalettes(onChange)
      expect(next[1]).toEqual({ ...initial[1], name: 'Sunset Orange' })
      expect(next[0]).toBe(initial[0])
    })

    it('adds a mid grey palette named after its position', async () => {
      const user = userEvent.setup()
      const { onChange, initial } = renderPanel()

      await user.click(screen.getByRole('button', { name: 'Add palette' }))

      const next = lastPalettes(onChange)
      expect(next).toHaveLength(initial.length + 1)
      expect(next.slice(0, initial.length)).toEqual(initial)
      expect(next[initial.length]).toEqual({
        id: expect.any(String),
        name: `Colour ${initial.length + 1}`,
        baseColor: 'oklch(0.6 0 0)',
      })
    })

    it('never repeats a palette name when adding after a removal', async () => {
      const user = userEvent.setup()
      const { onChange, initial } = renderPanel()

      await user.click(screen.getByRole('button', { name: 'Add palette' }))
      await user.click(
        screen.getByRole('button', { name: `Remove ${initial[1].name}` }),
      )
      await user.click(screen.getByRole('button', { name: 'Add palette' }))

      const names = lastPalettes(onChange).map((p) => p.name)
      expect(new Set(names).size).toBe(names.length)
    })

    it('removes a palette', async () => {
      const user = userEvent.setup()
      const { onChange, initial } = renderPanel()

      await user.click(
        screen.getByRole('button', { name: `Remove ${initial[1].name}` }),
      )

      expect(lastPalettes(onChange)).toEqual(initial.filter((_, i) => i !== 1))
    })
  })
})
