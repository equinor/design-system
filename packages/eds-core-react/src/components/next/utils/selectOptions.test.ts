import {
  defaultOptionsFilter,
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from './selectOptions'

describe('resolveOptionLabel', () => {
  it('returns a string option as-is', () => {
    expect(resolveOptionLabel('Copper')).toBe('Copper')
  })

  it('falls back to String() for non-string options without getOptionLabel', () => {
    expect(resolveOptionLabel(42)).toBe('42')
  })

  it('uses getOptionLabel for object options', () => {
    const option = { id: '1', name: 'Gullfaks A' }
    expect(resolveOptionLabel(option, (o) => o.name)).toBe('Gullfaks A')
  })

  it('ignores getOptionLabel for string options', () => {
    expect(resolveOptionLabel('Copper', () => 'IGNORED')).toBe('Copper')
  })
})

describe('resolveOptionKey', () => {
  it('uses getOptionValue when provided', () => {
    const option = { id: 'w1', name: 'Gullfaks A' }
    expect(resolveOptionKey(option, (o) => o.id)).toBe('w1')
  })

  it('falls back to the label when getOptionValue is not provided', () => {
    const option = { id: 'w1', name: 'Gullfaks A' }
    expect(resolveOptionKey(option, undefined, (o) => o.name)).toBe(
      'Gullfaks A',
    )
  })

  it('falls back to String() when neither getter is provided', () => {
    expect(resolveOptionKey(42)).toBe('42')
  })
})

describe('isOptionDisabled', () => {
  it('returns false when optionDisabled is not provided', () => {
    expect(isOptionDisabled('Lead')).toBe(false)
  })

  it('returns true when optionDisabled returns true', () => {
    expect(isOptionDisabled('Lead', (o) => o === 'Lead')).toBe(true)
  })

  it('returns false when optionDisabled returns false', () => {
    expect(isOptionDisabled('Copper', (o) => o === 'Lead')).toBe(false)
  })
})

describe('defaultOptionsFilter', () => {
  it('matches case-insensitively', () => {
    expect(defaultOptionsFilter('Copper', 'cop')).toBe(true)
    expect(defaultOptionsFilter('Copper', 'COP')).toBe(true)
  })

  it('returns false when the label does not contain the input', () => {
    expect(defaultOptionsFilter('Copper', 'zinc')).toBe(false)
  })

  it('uses getOptionLabel for object options', () => {
    const option = { name: 'Gullfaks A' }
    expect(defaultOptionsFilter(option, 'gull', (o) => o.name)).toBe(true)
    expect(defaultOptionsFilter(option, 'troll', (o) => o.name)).toBe(false)
  })

  it('matches empty input against everything', () => {
    expect(defaultOptionsFilter('Copper', '')).toBe(true)
  })
})
