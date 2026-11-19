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

describe('fixture format', () => {
  it('keeps the chain of instances and hidden layers through a pack', () => {
    const again = unpackFixture(packFixture(fixture, units))
    expect(again).toEqual(units)
    expect(units.filter((unit) => unit.hidden)).toHaveLength(4)
  })
})
