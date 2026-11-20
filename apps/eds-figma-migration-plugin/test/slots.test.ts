/**
 * Slot content an instance owns, for the scan, the change log and the reset
 * (found on a test page in Figma on 2026-11-19: Revert frame put back nothing
 * on owned slot content, because the change log was read against the outer
 * instance's overrides, which do not list that content).
 */
import { describe, expect, it } from 'vitest'
import {
  indexAmongChildren,
  isOwnedSlotContent,
  outermostInstance,
} from '../src/scan/slots'

type FakeNode = {
  id: string
  type: string
  parent: FakeNode | null
}

function tree() {
  const page: FakeNode = { id: '0:1', type: 'PAGE', parent: null }
  const frame: FakeNode = { id: '1:1', type: 'FRAME', parent: page }
  const editor: FakeNode = { id: '1:2', type: 'INSTANCE', parent: frame }
  // From the main component: a header with a button in it
  const header: FakeNode = { id: 'I1:2;5:1', type: 'FRAME', parent: editor }
  const close: FakeNode = { id: 'I1:2;5:2', type: 'INSTANCE', parent: header }
  const closeIcon: FakeNode = {
    id: 'I1:2;5:2;9:1',
    type: 'VECTOR',
    parent: close,
  }
  // A slot the instance owns: its content has ids below the slot's
  const slot: FakeNode = { id: 'I1:2;5:3', type: 'SLOT', parent: editor }
  const ownedFrame: FakeNode = {
    id: 'I1:2;5:3;7:1',
    type: 'FRAME',
    parent: slot,
  }
  const tab: FakeNode = {
    id: 'I1:2;5:3;7:2',
    type: 'INSTANCE',
    parent: ownedFrame,
  }
  const tabLabel: FakeNode = {
    id: 'I1:2;5:3;7:2;8:1',
    type: 'TEXT',
    parent: tab,
  }
  return { editor, header, close, closeIcon, slot, ownedFrame, tab, tabLabel }
}

describe('isOwnedSlotContent', () => {
  it('tells owned slot content from content that follows the main component', () => {
    const { slot, ownedFrame, editor } = tree()
    expect(isOwnedSlotContent(slot, ownedFrame)).toBe(true)
    // An untouched slot: the child has the main component's layer id
    const following: FakeNode = { id: 'I1:2;5:4', type: 'FRAME', parent: slot }
    expect(isOwnedSlotContent(slot, following)).toBe(false)
    expect(isOwnedSlotContent(editor, ownedFrame)).toBe(false)
  })

  it('reads a layer added in this session, with a plain id, as owned', () => {
    const { slot } = tree()
    const added: FakeNode = { id: '2117:515', type: 'TEXT', parent: slot }
    expect(isOwnedSlotContent(slot, added)).toBe(true)
    expect(outermostInstance(added, true)).toBeNull()
  })

  it('leaves the slot of a main component alone', () => {
    const component: FakeNode = { id: '3:1', type: 'COMPONENT', parent: null }
    const slot: FakeNode = { id: '3:2', type: 'SLOT', parent: component }
    const child: FakeNode = { id: '3:3', type: 'FRAME', parent: slot }
    expect(isOwnedSlotContent(slot, child)).toBe(false)
  })
})

describe('outermostInstance', () => {
  it('is the outer instance for layers from its main component', () => {
    const { editor, closeIcon, header } = tree()
    expect(outermostInstance(closeIcon, false)?.id).toBe(editor.id)
    expect(outermostInstance(header, true)?.id).toBe(editor.id)
  })

  it('starts over in owned slot content', () => {
    const { tab, tabLabel, ownedFrame } = tree()
    expect(outermostInstance(tabLabel, false)?.id).toBe(tab.id)
    expect(outermostInstance(tab, true)?.id).toBe(tab.id)
    expect(outermostInstance(tab, false)).toBeNull()
    expect(outermostInstance(ownedFrame, true)).toBeNull()
  })
})

describe('indexAmongChildren', () => {
  it('finds a layer by object, by id, then by its own id part', () => {
    const { slot } = tree()
    const a: FakeNode = { id: 'I1:2;5:3;7:1', type: 'FRAME', parent: slot }
    const b: FakeNode = { id: 'I1:2;5:3;2117:515', type: 'TEXT', parent: slot }
    const children = [a, b]
    expect(indexAmongChildren(children, b)).toBe(1)
    expect(indexAmongChildren(children, { ...b })).toBe(1)
    // The same layer as the session that added it sees it
    const plain: FakeNode = { id: '2117:515', type: 'TEXT', parent: slot }
    expect(indexAmongChildren(children, plain)).toBe(1)
  })

  it('gives -1 when the own id part is not unique or missing', () => {
    const { slot } = tree()
    const a: FakeNode = { id: 'I1:2;5:3;7:1', type: 'FRAME', parent: slot }
    const b: FakeNode = { id: 'I9:9;7:1', type: 'FRAME', parent: slot }
    expect(
      indexAmongChildren([a, b], { id: '7:1', type: 'FRAME', parent: slot }),
    ).toBe(-1)
    expect(
      indexAmongChildren([a], { id: '8:8', type: 'FRAME', parent: slot }),
    ).toBe(-1)
  })
})
