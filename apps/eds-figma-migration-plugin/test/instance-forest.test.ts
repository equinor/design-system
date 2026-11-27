/**
 * The Instances tab's tree (phase 2, 2026-11-19): instances in slot content
 * an instance owns go under that instance, the counts add up, and the
 * frames of the scan are the rows at the top, in their order.
 */
import { describe, expect, it } from 'vitest'
import { entryForest, instanceForest } from '../src/ui/instances'
import type { EntrySummary, InstanceTree, OldInstance } from '../src/scan/types'

const tree = (
  id: string,
  name: string,
  count: number,
  extra: Partial<InstanceTree> = {},
): InstanceTree => ({
  id,
  name,
  count,
  hiddenCount: 0,
  own: count,
  children: [],
  ...extra,
})

const instance = (
  id: string,
  entryId: string,
  count: number,
  extra: Partial<OldInstance> = {},
  treeExtra: Partial<InstanceTree> = {},
): OldInstance => ({
  id,
  name: id,
  entryId,
  count,
  tree: tree(id, id, count, treeExtra),
  ...extra,
})

const entry = (id: string, name: string, nodeIds = [id]): EntrySummary => ({
  id,
  kind: 'frame',
  name,
  pageId: 'page',
  pageName: 'Page',
  sections: [],
  nodeIds,
  counts: {
    migrated: 0,
    sure: 0,
    check: 0,
    byHand: 0,
    none: 0,
    inInstance: 0,
    other: 0,
  },
  health: null,
  oldInstances: 0,
})

const editor = { id: 'editor', name: 'Details panel' }

describe('instanceForest', () => {
  it('puts slot content under the instance that owns it, in layer order', () => {
    const forest = instanceForest([
      instance('editor', 'frame', 32),
      instance(
        'field',
        'frame',
        117,
        { within: editor },
        { slot: true, slotName: 'Content', hiddenCount: 83 },
      ),
      instance('switch', 'frame', 50, { within: editor }, { slot: true }),
    ])
    expect(forest).toHaveLength(1)
    const [root] = forest
    expect(root).toMatchObject({ id: 'editor', count: 199, hiddenCount: 83 })
    expect(root.children.map((child) => child.id)).toEqual(['field', 'switch'])
    expect(root.children[0]).toMatchObject({
      inSlot: true,
      slotName: 'Content',
    })
  })

  it('adds the counts of slot content to every instance above it', () => {
    const forest = instanceForest([
      instance(
        'editor',
        'frame',
        10,
        {},
        {
          count: 30,
          children: [tree('panel', 'Panel', 20)],
        },
      ),
      instance('field', 'frame', 5, { within: { id: 'panel', name: 'Panel' } }),
    ])
    const [root] = forest
    expect(root.count).toBe(35)
    expect(root.children[0]).toMatchObject({ id: 'panel', count: 25 })
  })

  it('shows the owner of slot content when the owner has no legacy values', () => {
    const forest = instanceForest([
      instance('field', 'frame', 117, { within: editor }),
    ])
    expect(forest).toHaveLength(1)
    expect(forest[0]).toMatchObject({
      id: 'editor',
      name: 'Details panel',
      count: 117,
    })
  })
})

describe('entryForest', () => {
  it('puts the instances under their frames, in the order of the scan', () => {
    const nodes = entryForest(
      [
        instance('b1', 'second', 4),
        instance('a1', 'first', 3),
        instance('a2', 'first', 2),
      ],
      [
        entry('first', 'First frame'),
        entry('second', 'Second frame', ['s1', 's2']),
      ],
    )
    expect(nodes.map((node) => [node.name, node.count])).toEqual([
      ['First frame', 5],
      ['Second frame', 4],
    ])
    expect(nodes[0]).toMatchObject({ kind: 'frame', goTo: ['first'] })
    expect(nodes[1].goTo).toEqual(['s1', 's2'])
    expect(nodes[0].children.map((child) => child.id)).toEqual(['a1', 'a2'])
  })

  it('names loose layers on the canvas after their page, with the page icon', () => {
    const onCanvas: EntrySummary = {
      ...entry('loose:page', 'Loose layers'),
      kind: 'loose',
      pageName: 'Test',
    }
    const inSection: EntrySummary = {
      ...entry('loose:section', 'Loose layers'),
      kind: 'loose',
      sections: ['Drafts', 'Draft 2'],
    }
    const nodes = entryForest(
      [instance('a', 'loose:page', 3), instance('b', 'loose:section', 2)],
      [onCanvas, inSection],
    )
    expect(nodes[0]).toMatchObject({ name: 'Test', page: true })
    expect(nodes[1].name).toBe('Draft 2')
    expect(nodes[1].page).toBeUndefined()
  })

  it('puts an owner made for slot content in the frame of its instances', () => {
    const nodes = entryForest(
      [instance('field', 'first', 117, { within: editor })],
      [entry('first', 'First frame')],
    )
    expect(nodes).toHaveLength(1)
    expect(nodes[0].children[0]).toMatchObject({ id: 'editor', count: 117 })
  })
})
