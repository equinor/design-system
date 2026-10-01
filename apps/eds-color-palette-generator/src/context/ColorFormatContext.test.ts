import { describe, expect, it } from 'vitest'
import { colourInFormat } from './ColorFormatContext'

describe('colourInFormat', () => {
  it('keeps OKLCH text as written', () => {
    expect(colourInFormat('oklch(0.4973 0.084851 204.553)', 'OKLCH')).toBe(
      'oklch(0.4973 0.084851 204.553)',
    )
  })

  it('converts hex and bare hex digits to OKLCH', () => {
    expect(colourInFormat('#ffffff', 'OKLCH')).toBe('oklch(1 0 0)')
    expect(colourInFormat('ffffff', 'OKLCH')).toBe('oklch(1 0 0)')
  })

  it('shows any colour as hex in HEX mode', () => {
    expect(colourInFormat('oklch(1 0 0)', 'HEX')).toBe('#ffffff')
  })
})
