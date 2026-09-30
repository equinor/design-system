import { describe, expect, it } from 'vitest'
import { deserializeState, serializeState } from './urlState'

const parse = (query: string) => deserializeState(new URLSearchParams(query))

describe('urlState tabs', () => {
  it('round-trips the tab', () => {
    expect(parse(serializeState({ activeTab: 'examples' })).activeTab).toBe(
      'examples',
    )
  })

  it('leaves the default tab out of the URL', () => {
    expect(serializeState({ activeTab: 'system' })).toBe('')
  })

  it('accepts the Norwegian keys from links shared before the translation', () => {
    expect(parse('tab=fargesystem').activeTab).toBe('system')
    expect(parse('tab=eksempler').activeTab).toBe('examples')
    expect(parse('tab=kontrast').activeTab).toBe('contrast')
  })

  it('ignores unknown tabs', () => {
    expect(parse('tab=nope').activeTab).toBeUndefined()
  })
})
