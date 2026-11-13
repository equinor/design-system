import { describe, expect, it } from 'vitest'
import { pageCountText, pagesToScan, scannablePages } from '../src/shared/pages'
import type { FilePage } from '../src/shared/pages'

const PAGES: FilePage[] = [
  { id: '1', name: 'Cover' },
  { id: '2', name: '---', divider: true },
  { id: '3', name: 'Screens' },
  { id: '4', name: 'Archive' },
]

describe('the pages a scan of the file reads', () => {
  it('reads every page but the dividers until pages are left out', () => {
    expect(pagesToScan(PAGES, [])).toEqual(['1', '3', '4'])
    expect(pageCountText(PAGES, [])).toBe('3/3 pages')
  })

  it('leaves out the chosen pages, in the order of the page list', () => {
    expect(pagesToScan(PAGES, ['4'])).toEqual(['1', '3'])
    expect(pageCountText(PAGES, ['4'])).toBe('2/3 pages')
  })

  it('reads a page added after the choice, as it is not left out', () => {
    const added = [...PAGES, { id: '5', name: 'New' }]
    expect(pagesToScan(added, ['4'])).toEqual(['1', '3', '5'])
    expect(pageCountText(added, ['4'])).toBe('3/4 pages')
  })

  it('ignores left-out ids of pages no longer in the file', () => {
    expect(pageCountText(PAGES, ['4', 'deleted'])).toBe('2/3 pages')
  })

  it('does not count dividers as pages', () => {
    expect(scannablePages(PAGES).map((page) => page.id)).toEqual([
      '1',
      '3',
      '4',
    ])
    expect(pageCountText([{ id: '1', name: 'Only' }], [])).toBe('1/1 page')
  })
})
