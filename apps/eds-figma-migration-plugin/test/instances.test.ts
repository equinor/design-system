/** The instance list in a main component's inspector. */
import { describe, expect, it } from 'vitest'
import { groupComponentInstances, legacySummary } from '../src/ui/instances'
import type { ComponentInstance } from '../src/scan/types'

const instance = (
  id: string,
  main: string | undefined,
  overridden = 0,
  fromMain = 0,
): ComponentInstance => ({
  id,
  name: main ?? id,
  path: ['Text Field', 'State=Default'],
  ...(main
    ? {
        mainComponent: {
          name: main,
          key: `key-${main}`,
          remote: main === 'error filled',
          ...(main === 'error filled' ? {} : { id: `id-${main}` }),
        },
      }
    : {}),
  overridden,
  fromMain,
})

describe('groupComponentInstances', () => {
  it('groups by main component, with legacy values first', () => {
    const groups = groupComponentInstances([
      instance('1', 'Label'),
      instance('2', '.Icon Wrapper', 2, 0),
      instance('3', '.Icon Wrapper', 0, 1),
      instance('4', 'error filled'),
    ])
    expect(groups.map((group) => group.name)).toEqual([
      '.Icon Wrapper',
      'error filled',
      'Label',
    ])
    expect(groups[0]).toMatchObject({
      overridden: 2,
      fromMain: 1,
      source: 'in this file',
      mainId: 'id-.Icon Wrapper',
    })
    expect(groups[0].instances.map((item) => item.id)).toEqual(['2', '3'])
    expect(groups[1]).toMatchObject({ source: 'from a library' })
    expect(groups[1].mainId).toBeUndefined()
  })

  it('keeps an instance without a main component under its own name', () => {
    const [group] = groupComponentInstances([instance('9', undefined)])
    expect(group).toMatchObject({
      name: '9',
      source: 'main component not found',
    })
  })
})

describe('legacySummary', () => {
  it('says where the legacy values change', () => {
    expect(legacySummary(0, 0)).toBe('No legacy values')
    expect(legacySummary(1, 0)).toBe('1 legacy value overridden here')
    expect(legacySummary(2, 3)).toBe(
      '2 legacy values overridden here, 3 legacy values from the main component',
    )
  })
})
