/**
 * What is inside an instance (Casper's case, 2026-11-18): the chain of
 * instances a value is in, slot content an instance owns, and the tree the
 * Instances tab shows.
 *
 * The fixture is the FRIOD test branch frame 2100:1825 "Casper case (local)",
 * exported with dist/collect-fixture.js and cut down to its legacy values. It
 * holds one instance of PE Editor (test), whose main component has a header
 * (a Typography title and a Close button) and a slot. The instance owns its
 * slot content: Tabs with legacy strokes, a hidden Badge and a Badge with a
 * legacy mode, a Button with a legacy icon fill, and two Typography
 * instances, one of them hidden.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { classifyUnits } from '../src/scan/classify'
import { packFixture, unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { buildInstanceTree } from '../src/scan/instance-tree'
import { hasInner, slotKeyOf, valueTree } from '../src/ui/instances'
import type { BindingRecord, InstanceStep } from '../src/scan/types'

const fixture = JSON.parse(
  readFileSync(
    new URL('./fixtures/nested-instances.json', import.meta.url),
    'utf8',
  ),
) as PackedFixture

const units = unpackFixture(fixture)
const records = classifyUnits(units)

const PE_EDITOR = '2100:1826'
const SLOT = `I${PE_EDITOR};2100:1813`
const stepOf = (id: string): InstanceStep => {
  const step = fixture.steps?.[id]
  if (!step) throw new Error(`No step ${id}`)
  return step
}
const on = (nodeId: string) =>
  records.filter((record) => record.nodeId === nodeId)

describe('slot content an instance owns', () => {
  it('reads legacy values an instance in it sets as its own overrides', () => {
    for (const id of [
      `${SLOT};2100:1952`,
      `${SLOT};2100:1953`,
      `${SLOT};2100:1954`,
      `${SLOT};2100:2033`,
    ]) {
      const [record] = on(id)
      expect(record, id).toMatchObject({ instanceId: id, override: true })
      expect(record.category, id).not.toBe('inInstance')
    }
    const [icon] = on(`${SLOT};2100:2108;5823:7987;67:16`)
    expect(icon).toMatchObject({
      instanceId: `${SLOT};2100:2108`,
      override: true,
    })
    expect(icon.category).not.toBe('inInstance')
  })

  it('makes an instance in it the outermost one for its layers', () => {
    const typography = records.filter(
      (record) => record.instanceId === `${SLOT};2100:2150`,
    )
    expect(typography).toHaveLength(3)
    for (const record of typography) {
      expect(record.category).toBe('inInstance')
      expect(record.hidden).toBe(true)
    }
  })

  it('keeps PE Editor in the chain of every value below it', () => {
    for (const record of records) {
      expect(record.instances?.[0]?.id).toBe(PE_EDITOR)
    }
    expect(stepOf(`${SLOT};2100:1954`)).toMatchObject({
      hidden: true,
      slot: true,
    })
    expect(stepOf(`I${PE_EDITOR};2100:1777`).slot).toBeUndefined()
  })
})

describe('values an instance takes from its main component', () => {
  it('keeps them with the instance, outside its owned slot content', () => {
    const fromMain = records.filter(
      (record) =>
        record.instanceId === PE_EDITOR && record.category === 'inInstance',
    )
    expect(fromMain).toHaveLength(16)
    expect(fromMain.every((record) => !record.override)).toBe(true)
  })
})

describe('buildInstanceTree', () => {
  it('shows where in PE Editor its legacy values are', () => {
    const tree = buildInstanceTree(stepOf(PE_EDITOR), records)
    expect(tree).toMatchObject({
      id: PE_EDITOR,
      name: 'PE Editor (test)',
      count: 16,
      hiddenCount: 0,
      own: 12,
    })
    expect(
      tree.children.map((child) => [child.name, child.count, child.own]),
    ).toEqual([
      ['Typography', 3, 3],
      ['Close', 1, 0],
    ])
    const close = tree.children[1]
    expect(close.component).toBe('Button [EDS Beta]')
    expect(close.children.map((child) => [child.name, child.own])).toEqual([
      ['Leading Icon', 1],
    ])
  })

  it('counts the values on hidden layers', () => {
    const tree = buildInstanceTree(stepOf(`${SLOT};2100:2150`), records)
    expect(tree).toMatchObject({
      count: 3,
      hiddenCount: 3,
      own: 3,
      hidden: true,
      slot: true,
      children: [],
    })
  })

  it('leaves out values of other instances and values in Changes', () => {
    const root: InstanceStep = { id: 'a', name: 'A' }
    const record = (extra: Partial<BindingRecord>): BindingRecord => ({
      id: Math.random().toString(),
      nodeId: 'n',
      nodeName: 'n',
      nodeType: 'FRAME',
      entryId: 'e',
      path: [],
      property: { type: 'field', field: 'paddingLeft' },
      group: 'spacing',
      category: 'inInstance',
      instanceId: 'a',
      ...extra,
    })
    const tree = buildInstanceTree(root, [
      record({}),
      record({ category: 'sure', override: true }),
      record({ instanceId: 'b' }),
      record({
        hidden: true,
        instances: [root, { id: 'c', name: 'C', hidden: true }],
      }),
    ])
    expect(tree).toMatchObject({ count: 2, hiddenCount: 1, own: 1 })
    expect(tree.children).toMatchObject([
      { id: 'c', count: 1, hiddenCount: 1, own: 1, hidden: true },
    ])
  })
})

describe('valueTree', () => {
  // Every value in PE Editor's group of the frame's Layers view
  const inPeEditor = records.filter(
    (record) => record.instances?.[0]?.id === PE_EDITOR,
  )
  const { root, own } = valueTree(stepOf(PE_EDITOR), inPeEditor)
  const child = (id: string) => {
    const found = root.children.find((node) => node.id === id)
    if (!found) throw new Error(`No node ${id}`)
    return found
  }

  it('puts every value of the instance in the tree, overrides too', () => {
    expect(root).toMatchObject({ count: inPeEditor.length, overridden: 5 })
    const leaves = [...own.values()].flat()
    expect(leaves).toHaveLength(inPeEditor.length)
    expect(leaves.filter((record) => record.override)).toHaveLength(5)
  })

  it('puts the instances of its owned slot under it, in the slot', () => {
    const slotted = root.children.filter((node) => node.inSlot)
    expect(slotted.map((node) => node.id)).toEqual([
      `${SLOT};2100:1952`,
      `${SLOT};2100:1953`,
      `${SLOT};2100:1954`,
      `${SLOT};2100:1955`,
      `${SLOT};2100:2033`,
      `${SLOT};2100:2108`,
      `${SLOT};2100:2150`,
    ])
  })

  it('gives each value to the instance whose own layer it is on', () => {
    // The Button's legacy icon fill is on the icon instance in it, two
    // levels below PE Editor, and the Button has none of its own.
    const button = child(`${SLOT};2100:2108`)
    expect(button).toMatchObject({ own: 0, count: 1, overridden: 1 })
    const [icon] = button.children
    expect(own.get(icon.key)?.map((record) => record.nodeId)).toEqual([
      `${SLOT};2100:2108;5823:7987;67:16`,
    ])
    expect(own.get(button.key)).toBeUndefined()
    // Go to on the row of the values directly in an instance selects their layers
    expect(icon.ownIds).toEqual([`${SLOT};2100:2108;5823:7987;67:16`])
    expect(button.ownIds).toBeUndefined()
  })

  it('keeps a hidden instance hidden, with its values counted as hidden', () => {
    expect(child(`${SLOT};2100:2150`)).toMatchObject({
      hidden: true,
      count: 3,
      hiddenCount: 3,
    })
  })

  it('lists the values an instance overrides first on each row', () => {
    const top = {
      id: 'a',
      name: 'A',
    }
    const record = (id: string, override: boolean): BindingRecord => ({
      id,
      nodeId: 'a',
      nodeName: 'A',
      nodeType: 'INSTANCE',
      entryId: 'frame',
      path: [],
      property: { type: 'field', field: 'paddingLeft' },
      group: 'spacing',
      category: override ? 'sure' : 'inInstance',
      instanceId: 'a',
      ...(override ? { override: true } : {}),
    })
    const tree = valueTree(top, [record('1', false), record('2', true)])
    expect(tree.own.get('a')?.map((item) => item.id)).toEqual(['2', '1'])
    expect(tree.root).toMatchObject({ own: 2, ownOverridden: 1 })
  })

  it('puts the values on a frame in an owned slot under the slot', () => {
    // Casper's Actions frame in PE Editor's Content slot: not an instance,
    // so it has no instanceId, but its chain ends at PE Editor.
    const pe = { id: 'pe', name: 'PE Editor' }
    const field = {
      id: 'pe;slot;tf',
      name: 'Text Field',
      slot: true as const,
      slotName: 'Content',
    }
    const base: Pick<BindingRecord, 'entryId' | 'path' | 'property' | 'group'> =
      {
        entryId: 'frame',
        path: [],
        property: { type: 'field', field: 'paddingLeft' },
        group: 'spacing',
      }
    const records: BindingRecord[] = [
      {
        ...base,
        id: 'own',
        nodeId: 'pe',
        nodeName: 'PE Editor',
        nodeType: 'INSTANCE',
        category: 'inInstance',
        instanceId: 'pe',
        instances: [pe],
      },
      {
        ...base,
        id: 'frame',
        nodeId: 'pe;slot;actions',
        nodeName: 'Actions',
        nodeType: 'FRAME',
        category: 'sure',
        instances: [pe],
        slotName: 'Content',
      },
      {
        ...base,
        id: 'field',
        nodeId: 'pe;slot;tf',
        nodeName: 'Text Field',
        nodeType: 'INSTANCE',
        category: 'sure',
        override: true,
        instanceId: 'pe;slot;tf',
        instances: [pe, field],
      },
    ]
    const { root, own } = valueTree(pe, records)
    expect(root).toMatchObject({ count: 3, own: 1, overridden: 1 })
    expect(root.slotValues).toEqual([
      { slot: 'Content', own: 1, ownIds: ['pe;slot;actions'] },
    ])
    expect(own.get(slotKeyOf('pe', 'Content'))?.map((item) => item.id)).toEqual(
      ['frame'],
    )
    expect(own.get('pe')?.map((item) => item.id)).toEqual(['own'])
    expect(root.children).toMatchObject([
      { id: 'pe;slot;tf', inSlot: true, slotName: 'Content', own: 1 },
    ])
    expect(hasInner(root)).toBe(true)
  })
})

describe('fixture format', () => {
  it('keeps the chain of instances and hidden layers through a pack', () => {
    const again = unpackFixture(packFixture(fixture, units))
    expect(again).toEqual(units)
    expect(units.filter((unit) => unit.hidden)).toHaveLength(4)
  })

  it('keeps the slot of a layer in owned slot content through a pack', () => {
    const withSlot = units.map((unit, index) =>
      index === 0 ? { ...unit, slotName: 'Content' } : unit,
    )
    const [first] = unpackFixture(packFixture(fixture, withSlot))
    expect(first.slotName).toBe('Content')
  })
})
