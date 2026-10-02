// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SimpleColorPicker } from './SimpleColorPicker'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_HUES } from '@/config/tokensStudio'
import { colourInFormat } from '@/context/ColorFormatContext'
import { parseColorToHex, toOklchString } from '@/utils/color'
import { localStorageUtils } from '@/utils/localStorage'

const ANCHOR = TS_HUES[0].anchor

function renderPicker(value = ANCHOR) {
  const onChange = vi.fn<(colour: string) => void>()
  renderWithProviders(
    <SimpleColorPicker value={value} onChange={onChange} label="Moss" />,
  )
  return { onChange }
}

const textField = () =>
  screen.getByRole('textbox', { name: 'Moss colour value' })

describe('SimpleColorPicker', () => {
  describe('Rendering', () => {
    it('shows an OKLCH value as written', () => {
      renderPicker()

      expect(textField()).toHaveValue(ANCHOR)
      expect(textField()).toHaveAttribute('aria-invalid', 'false')
    })

    it('shows the value as hex when the page format is HEX', () => {
      localStorageUtils.setColorFormat('HEX')
      renderPicker()

      expect(textField()).toHaveValue(colourInFormat(ANCHOR, 'HEX'))
    })

    it('shows a bare hex value from an old link as OKLCH', () => {
      renderPicker('206f77')

      expect(textField()).toHaveValue(toOklchString('#206f77'))
    })

    it('gives the native picker the colour as hex', () => {
      renderPicker()

      // The native colour input has no role; find it by its value.
      expect(
        screen.getByDisplayValue(parseColorToHex(ANCHOR) ?? ''),
      ).toHaveAttribute('type', 'color')
    })
  })

  describe('Behaviour', () => {
    it('keeps an unfinished value as a draft without storing it', async () => {
      const user = userEvent.setup()
      const { onChange } = renderPicker()

      await user.clear(textField())
      await user.type(textField(), 'oklch(0.5')

      expect(textField()).toHaveValue('oklch(0.5')
      expect(textField()).toHaveAttribute('aria-invalid', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('passes a valid OKLCH value on trimmed', async () => {
      const user = userEvent.setup()
      const { onChange } = renderPicker()

      await user.clear(textField())
      await user.paste(' oklch(0.5 0.1 200) ')

      expect(onChange).toHaveBeenCalledWith('oklch(0.5 0.1 200)')
    })

    it('converts a hex value typed in HEX mode to OKLCH', async () => {
      localStorageUtils.setColorFormat('HEX')
      const user = userEvent.setup()
      const { onChange } = renderPicker()

      await user.clear(textField())
      await user.paste('#00ff00')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(toOklchString('#00ff00'))
    })

    it('converts the native picker choice to OKLCH', () => {
      const { onChange } = renderPicker()
      const native = screen.getByDisplayValue(parseColorToHex(ANCHOR) ?? '')

      fireEvent.change(native, { target: { value: '#123456' } })

      expect(onChange).toHaveBeenCalledWith(toOklchString('#123456'))
    })

    it('shows the stored value again on blur', async () => {
      const user = userEvent.setup()
      renderPicker()

      await user.clear(textField())
      await user.type(textField(), 'not a colour')
      await user.tab()

      expect(textField()).toHaveValue(ANCHOR)
      expect(textField()).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Accessibility', () => {
    it('names the native picker button after the label', () => {
      renderPicker()

      expect(
        screen.getByRole('button', { name: 'Pick Moss colour' }),
      ).toBeInTheDocument()
    })

    it('uses Colour as the default label', () => {
      renderWithProviders(
        <SimpleColorPicker value={ANCHOR} onChange={vi.fn()} />,
      )

      expect(
        screen.getByRole('textbox', { name: 'Colour colour value' }),
      ).toBeInTheDocument()
    })
  })
})
