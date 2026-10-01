// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScaleStrip } from './ScaleStrip'

const COLOURS = Array.from(
  { length: 15 },
  (_, i) => `oklch(${(i + 1) / 16} 0.1 200)`,
)

describe('ScaleStrip', () => {
  it('lists 15 numbered swatches under its accessible name', () => {
    render(<ScaleStrip colours={COLOURS} label="Moss Green, light mode" />)

    const list = screen.getByRole('list', { name: 'Moss Green, light mode' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(15)
    expect(items[0]).toHaveTextContent('1')
    expect(items[14]).toHaveTextContent('15')
  })

  it('paints each swatch with its colour and names it in the tooltip', () => {
    render(<ScaleStrip colours={COLOURS} label="Scale" />)

    const swatch = screen.getByTitle(`Step 9: ${COLOURS[8]}`)
    expect(swatch.style.backgroundColor).not.toBe('')
  })

  it('outlines only the marked steps', () => {
    render(<ScaleStrip colours={COLOURS} label="Scale" marked={[4, 12]} />)

    const outlined = (step: number) =>
      screen
        .getByTitle(`Step ${step}: ${COLOURS[step - 1]}`)
        .className.includes('outline-2')
    expect(outlined(4)).toBe(true)
    expect(outlined(12)).toBe(true)
    expect(outlined(5)).toBe(false)
  })
})
