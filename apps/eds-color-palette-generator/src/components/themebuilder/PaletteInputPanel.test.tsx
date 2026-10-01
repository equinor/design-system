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
import { toCssColor, toOklchString } from '@/utils/color'
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

    it('shows the anchor count instead of the colour field for anchor palettes', () => {
      const [first, ...rest] = tokensStudioInputs()
      renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [
            { step: 3, value: first.baseColor },
            { step: 11, value: first.baseColor },
          ],
        },
        ...rest,
      ])

      expect(screen.getByText('2 anchors')).toBeInTheDocument()
      expect(
        screen.queryByRole('textbox', { name: `${first.name} colour value` }),
      ).not.toBeInTheDocument()
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
      expect(first.anchors).toBeUndefined()
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

  describe('Anchors', () => {
    it('expands a row to edit anchors', async () => {
      const user = userEvent.setup()
      renderPanel()
      const name = TS_HUES[0].name
      const toggle = screen.getByRole('button', {
        name: `Edit anchors for ${name}`,
      })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')

      await user.click(toggle)

      expect(
        screen.getByRole('button', { name: `Collapse ${name}` }),
      ).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('Single colour mode')).toBeInTheDocument()
    })

    it('switches a single colour to one anchor on step 9', async () => {
      const user = userEvent.setup()
      const { onChange, initial } = renderPanel()
      const name = initial[0].name
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${name}` }),
      )

      await user.click(
        screen.getByRole('button', { name: 'Switch to anchors' }),
      )

      expect(lastPalettes(onChange)[0].anchors).toEqual([
        { value: toCssColor(initial[0].baseColor), step: 9 },
      ])
      expect(
        screen.getByRole('combobox', { name: 'Step for anchor 1' }),
      ).toHaveValue('9')
      expect(
        screen.getByRole('textbox', { name: 'Colour value for anchor 1' }),
      ).toHaveValue(initial[0].baseColor)
    })

    it('adds an anchor on the first free step and removes it again', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      const { onChange } = renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [{ step: 1, value: first.baseColor }],
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )
      expect(
        screen.queryByRole('button', { name: 'Remove anchor 1' }),
      ).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Add anchor' }))

      const anchors = lastPalettes(onChange)[0].anchors
      expect(anchors).toHaveLength(2)
      expect(anchors?.[0]).toEqual({ step: 1, value: first.baseColor })
      expect(anchors?.[1].step).toBe(2)

      await user.click(screen.getByRole('button', { name: 'Remove anchor 2' }))

      expect(lastPalettes(onChange)[0].anchors).toEqual([
        { step: 1, value: first.baseColor },
      ])
    })

    it('disables Add anchor when every step has an anchor', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: Array.from({ length: 15 }, (_, i) => ({
            step: i + 1,
            value: first.baseColor,
          })),
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )

      expect(screen.getByRole('button', { name: 'Add anchor' })).toBeDisabled()
    })

    it('marks a step used by another anchor as unavailable', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [
            { step: 4, value: first.baseColor },
            { step: 12, value: first.baseColor },
          ],
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )

      const select = screen.getByRole('combobox', { name: 'Step for anchor 1' })
      expect(
        within(select).getByRole('option', { name: 'Step 12 (used)' }),
      ).toBeDisabled()
      expect(
        within(select).getByRole('option', { name: 'Step 4' }),
      ).toBeEnabled()
    })

    it('moves an anchor to another step', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      const { onChange } = renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [{ step: 9, value: first.baseColor }],
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Step for anchor 1' }),
        '5',
      )

      expect(lastPalettes(onChange)[0].anchors).toEqual([
        { step: 5, value: first.baseColor },
      ])
    })

    it('stores an anchor typed as hex in HEX mode as OKLCH', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      const { onChange } = renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [{ step: 9, value: first.baseColor }],
        },
        ...rest,
      ])
      await user.click(formatRadio('HEX'))
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )
      const field = screen.getByRole('textbox', {
        name: 'Colour value for anchor 1',
      })
      expect(field).toHaveValue(colourInFormat(first.baseColor, 'HEX'))

      await user.clear(field)
      await user.paste('#0000ff')

      expect(lastPalettes(onChange)[0].anchors).toEqual([
        { step: 9, value: toOklchString('#0000ff') },
      ])
    })

    it('marks an invalid anchor value and does not store it', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      const { onChange } = renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [{ step: 9, value: first.baseColor }],
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )
      const field = screen.getByRole('textbox', {
        name: 'Colour value for anchor 1',
      })

      await user.clear(field)
      await user.paste('nope')

      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('switches back to a single colour from the first anchor', async () => {
      const user = userEvent.setup()
      const [first, ...rest] = tokensStudioInputs()
      const { onChange } = renderPanel([
        {
          ...first,
          baseColor: '',
          anchors: [
            { step: 4, value: '#336699' },
            { step: 12, value: first.baseColor },
          ],
        },
        ...rest,
      ])
      await user.click(
        screen.getByRole('button', { name: `Edit anchors for ${first.name}` }),
      )

      await user.click(screen.getByRole('button', { name: 'Switch to simple' }))

      const [next] = lastPalettes(onChange)
      expect(next.anchors).toBeUndefined()
      expect(next.baseColor).toBe(toOklchString('#336699'))
      expect(colourField(first.name)).toHaveValue(toOklchString('#336699'))
    })
  })
})
