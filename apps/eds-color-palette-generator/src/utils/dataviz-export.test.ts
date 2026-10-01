// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SwatchColor } from '@/config/dataviz-types'
import {
  downloadText,
  toCssVars,
  toHexArray,
  toW3CTokens,
} from './dataviz-export'
import { formatColorsAsTokens } from './tokenFormatter'

const colors: SwatchColor[] = [
  { name: 'One', hex: '#111111' },
  { name: 'Two', hex: '#222222' },
  { name: 'Three', hex: '#333333' },
]

// jsdom's Blob has no text(), so read it the way a browser page would
const readBlob = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(blob)
  })

describe('toHexArray', () => {
  it('lists the hex values in order as pretty-printed JSON', () => {
    const json = toHexArray(colors)
    expect(JSON.parse(json)).toEqual(['#111111', '#222222', '#333333'])
    expect(json).toBe(JSON.stringify(JSON.parse(json), null, 2))
  })

  it('returns an empty array for no colours', () => {
    expect(toHexArray([])).toBe('[]')
  })
})

describe('toCssVars', () => {
  it('writes one numbered custom property per colour inside :root', () => {
    expect(toCssVars(colors, 'categorical')).toBe(
      ':root {\n' +
        '  --dataviz-cat-1: #111111;\n' +
        '  --dataviz-cat-2: #222222;\n' +
        '  --dataviz-cat-3: #333333;\n' +
        '}\n',
    )
  })

  it('uses a short prefix for each kind', () => {
    expect(toCssVars(colors, 'categorical')).toContain('--dataviz-cat-1:')
    expect(toCssVars(colors, 'sequential')).toContain('--dataviz-seq-1:')
    expect(toCssVars(colors, 'diverging')).toContain('--dataviz-div-1:')
  })

  it('never uses the --eds- prefix that Tokens Studio owns', () => {
    for (const kind of ['categorical', 'sequential', 'diverging'] as const) {
      expect(toCssVars(colors, kind)).not.toContain('--eds-')
    }
  })
})

describe('toW3CTokens', () => {
  it('groups the colours under the kind name', () => {
    const tokens = JSON.parse(toW3CTokens(colors, 'sequential'))
    expect(Object.keys(tokens)).toEqual(['sequential'])
    expect(Object.keys(tokens.sequential)).toEqual(['1', '2', '3'])
    expect(tokens.sequential['2'].$value).toBe('#222222')
    expect(tokens.sequential['2'].$type).toBe('color')
  })

  it('uses the same token shape as the UI token export', () => {
    expect(toW3CTokens(colors, 'diverging')).toBe(
      formatColorsAsTokens({ diverging: colors.map((c) => c.hex) }),
    )
  })
})

describe('downloadText', () => {
  const objectUrl = 'blob:http://localhost/palette'
  let createObjectURL: ReturnType<typeof vi.fn<(blob: Blob) => string>>
  let revokeObjectURL: ReturnType<typeof vi.fn<(url: string) => void>>

  beforeEach(() => {
    createObjectURL = vi.fn<(blob: Blob) => string>(() => objectUrl)
    revokeObjectURL = vi.fn<(url: string) => void>()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('clicks a link with the file name and the object URL', () => {
    const clicked: HTMLAnchorElement[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicked.push(this)
    })
    downloadText('palette.json', '{}')
    expect(clicked).toHaveLength(1)
    expect(clicked[0].download).toBe('palette.json')
    expect(clicked[0].href).toBe(objectUrl)
  })

  it('puts the content in a blob of the given type', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    downloadText('tokens.css', ':root {}', 'text/css')
    expect(createObjectURL).toHaveBeenCalledOnce()
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('text/css')
    expect(await readBlob(blob)).toBe(':root {}')
  })

  it('uses plain text when no type is given', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    downloadText('notes.txt', 'hello')
    expect(createObjectURL.mock.calls[0][0].type).toBe('text/plain')
  })

  it('removes the link and revokes the URL afterwards', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    downloadText('palette.json', '{}')
    expect(document.querySelector('a')).toBeNull()
    expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl)
  })

  it('does nothing without a document', () => {
    vi.stubGlobal('document', undefined)
    expect(() => downloadText('palette.json', '{}')).not.toThrow()
    expect(createObjectURL).not.toHaveBeenCalled()
  })
})
