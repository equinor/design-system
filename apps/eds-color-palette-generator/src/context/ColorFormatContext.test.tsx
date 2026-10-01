// @vitest-environment jsdom
// `colourInFormat` itself is covered in ColorFormatContext.test.ts; this file
// covers the provider and the hook.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { ColorFormatProvider, useColorFormat } from './ColorFormatContext'

const WHITE_OKLCH = 'oklch(1 0 0)'

/** Shows the format and one colour in it, and records every format it renders with. */
function Probe({ seen = [] }: { seen?: string[] }) {
  const { format, setFormat, formatColour } = useColorFormat()
  seen.push(format)
  return (
    <>
      <output aria-label="Format">{format}</output>
      <output aria-label="White">{formatColour(WHITE_OKLCH)}</output>
      <output aria-label="Hex white">{formatColour('#ffffff')}</output>
      <button onClick={() => setFormat('HEX')}>HEX</button>
      <button onClick={() => setFormat('OKLCH')}>OKLCH</button>
    </>
  )
}

function renderProvider(seen?: string[]) {
  return render(
    <ColorFormatProvider>
      <Probe seen={seen} />
    </ColorFormatProvider>,
  )
}

const output = (name: string) => screen.getByLabelText(name)
const saved = () => localStorage.getItem(STORAGE_KEYS.COLOR_FORMAT)

describe('ColorFormatProvider', () => {
  describe('Initial format', () => {
    it('defaults to OKLCH and shows colours as OKLCH', () => {
      renderProvider()

      expect(output('Format')).toHaveTextContent('OKLCH')
      expect(output('White')).toHaveTextContent(WHITE_OKLCH)
      expect(output('Hex white')).toHaveTextContent(WHITE_OKLCH)
    })

    it('renders OKLCH first and applies a saved HEX after mount', () => {
      localStorage.setItem(STORAGE_KEYS.COLOR_FORMAT, JSON.stringify('HEX'))
      const seen: string[] = []
      renderProvider(seen)

      expect(seen[0]).toBe('OKLCH')
      expect(seen.at(-1)).toBe('HEX')
      expect(output('White')).toHaveTextContent('#ffffff')
    })

    it('does not save anything on mount', () => {
      renderProvider()

      expect(saved()).toBeNull()
    })
  })

  describe('setFormat', () => {
    it('switches formatColour to HEX and saves the choice', async () => {
      const user = userEvent.setup()
      renderProvider()

      await user.click(screen.getByRole('button', { name: 'HEX' }))

      expect(output('Format')).toHaveTextContent('HEX')
      expect(output('White')).toHaveTextContent('#ffffff')
      expect(output('Hex white')).toHaveTextContent('#ffffff')
      expect(saved()).toBe(JSON.stringify('HEX'))
    })

    it('switches back to OKLCH and saves that too', async () => {
      const user = userEvent.setup()
      localStorage.setItem(STORAGE_KEYS.COLOR_FORMAT, JSON.stringify('HEX'))
      renderProvider()

      await user.click(screen.getByRole('button', { name: 'OKLCH' }))

      expect(output('White')).toHaveTextContent(WHITE_OKLCH)
      expect(saved()).toBe(JSON.stringify('OKLCH'))
    })
  })
})

describe('useColorFormat', () => {
  it('throws outside a ColorFormatProvider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Probe />)).toThrow(
      'useColorFormat must be used within a ColorFormatProvider',
    )
    error.mockRestore()
  })
})
