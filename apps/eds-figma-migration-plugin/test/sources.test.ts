/**
 * Where the legacy values of an instance can be fixed (phase 3, 2026-11-20):
 * the main components the check imports, and how the Instances tab groups
 * them in Where to fix them. Casper's PE Editor is from another file, and the
 * Core Components in its slot have a library update with no legacy values.
 */
import { describe, expect, it } from 'vitest'
import { remoteMainComponents } from '../src/scan/sources'
import type { ComponentSource, OldInstance } from '../src/scan/types'
import { checkSummary, knownSources, sourceGroups } from '../src/ui/instances'
import { nothingLeftText } from '../src/ui/labels'

const instance = (
  id: string,
  name: string,
  count: number,
  remote = true,
  extra: Partial<OldInstance> = {},
): OldInstance => ({
  id,
  name,
  entryId: 'page',
  count,
  mainComponent: { name, key: `key-${name}`, remote },
  ...extra,
})

const instances = [
  instance('pe', 'PE Editor', 32),
  instance('tf1', 'Text Field [EDS]', 117, true, {
    within: { id: 'pe', name: 'PE Editor' },
  }),
  instance('tf2', 'Text Field [EDS]', 119, true, {
    within: { id: 'pe', name: 'PE Editor' },
  }),
  instance('card', 'Card', 4, false),
  instance('type', 'Typography', 3, true, { typography: true }),
]

describe('remoteMainComponents', () => {
  it('checks each library main component once, not Typography or this file', () => {
    expect(remoteMainComponents(instances)).toEqual([
      { key: 'key-PE Editor', instanceId: 'pe' },
      { key: 'key-Text Field [EDS]', instanceId: 'tf1' },
    ])
  })
})

describe('sourceGroups', () => {
  const checked = new Map<string, ComponentSource>([
    ['key-PE Editor', { kind: 'no-library' }],
    ['key-Text Field [EDS]', { kind: 'update', legacy: 152, latestLegacy: 0 }],
  ])

  it('knows a main component in this file without a check', () => {
    expect(knownSources(instances, new Map()).get('key-Card')).toEqual({
      kind: 'this-file',
    })
  })

  it('puts a library update first, with its instances and values added up', () => {
    const groups = sourceGroups(instances, knownSources(instances, checked))
    expect(groups.map((group) => group.kind)).toEqual([
      'update',
      'this-file',
      'no-library',
    ])
    expect(groups[0].components).toEqual([
      {
        key: 'key-Text Field [EDS]',
        name: 'Text Field [EDS]',
        source: { kind: 'update', legacy: 152, latestLegacy: 0 },
        instanceIds: ['tf1', 'tf2'],
        count: 236,
      },
    ])
  })

  it('leaves out instances whose source is not known yet', () => {
    const groups = sourceGroups(instances, new Map())
    expect(groups).toEqual([])
  })
})

describe('checkSummary', () => {
  const sources = new Map<string, ComponentSource>([
    ['a', { kind: 'update', legacy: 152, latestLegacy: 0 }],
    ['b', { kind: 'update', legacy: 38, latestLegacy: 0 }],
    ['c', { kind: 'no-library' }],
  ])

  it('says how many it checked and what it found', () => {
    expect(
      checkSummary(
        {
          done: 3,
          total: 3,
          running: false,
          checked: ['a', 'b', 'c'],
          runs: 1,
        },
        sources,
      ),
    ).toBe(
      'Checked 3 library components: 2 with a library update, 1 not in a library.',
    )
  })

  it('names a few main components, so the one not in a library is known', () => {
    const names = new Map([
      ['a', 'Text Field [EDS]'],
      ['b', 'Switch [EDS]'],
      ['c', '_Badge [EDS]'],
    ])
    expect(
      checkSummary(
        {
          done: 3,
          total: 3,
          running: false,
          checked: ['a', 'b', 'c'],
          runs: 1,
        },
        sources,
        names,
      ),
    ).toBe(
      'Checked 3 library components: 2 with a library update (Text Field [EDS], Switch [EDS]), 1 not in a library (_Badge [EDS]).',
    )
  })

  it('says where a stopped check stopped', () => {
    expect(
      checkSummary(
        {
          done: 1,
          total: 3,
          running: false,
          checked: ['a'],
          runs: 1,
          stopped: true,
        },
        sources,
      ),
    ).toBe('Stopped after 1 of 3: 1 with a library update.')
  })

  it('says so when there was nothing to check', () => {
    expect(
      checkSummary(
        { done: 0, total: 0, running: false, checked: [], runs: 1 },
        sources,
      ),
    ).toBe(
      'No library components to check: every main component here is in this file.',
    )
  })
})

describe('nothingLeftText', () => {
  it('says how many values are left inside instances, not that all is done', () => {
    expect(nothingLeftText(638, 'in the scope')).toBe(
      'Nothing left to change in the scope. 638 legacy values are left inside instances; the Instances tab shows where to fix them.',
    )
    expect(nothingLeftText(1, 'in this frame')).toBe(
      'Nothing left to change in this frame. 1 legacy value is left inside instances; the Instances tab shows where to fix it.',
    )
  })

  it('says nothing is left when nothing is', () => {
    expect(nothingLeftText(0, 'in the scope')).toBe(
      'Nothing left to migrate in the scope.',
    )
  })
})
