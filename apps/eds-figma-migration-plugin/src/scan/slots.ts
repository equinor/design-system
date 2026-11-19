/**
 * Slot content an instance owns. A slot in an instance follows its main
 * component until the slot is edited in the instance; then all its content
 * gets new ids below the slot's own id (`I<instance>;<slot>;<new id>`), no
 * longer follows the main component and is not in the instance's
 * `overrides`. Content that follows the main component has the id of the
 * main component's layer after the instance's (`I<instance>;<layer>`).
 * Tested on the FRIOD test page and on the pasted PE Editor, 2026-11-19.
 *
 * The scan, the change log and the reset of a Manual fix all ask which
 * instance's `overrides` list the changes on a layer. Owned slot content
 * answers that like a frame: an instance in it is the outermost one for its
 * layers, and a layer in it outside any instance has none.
 */

/** The fields of a layer the checks read, so they run without Figma in the tests. */
export type SlotLayer = {
  readonly id: string
  readonly type: string
  readonly parent: SlotLayer | null
}

/** Whether `child` is slot content that the instance holding the slot `parent` owns. */
export function isOwnedSlotContent(
  parent: SlotLayer,
  child: SlotLayer,
): boolean {
  return parent.type === 'SLOT' && child.id.startsWith(`${parent.id};`)
}

/**
 * The outermost instance whose `overrides` list the changes on `node`,
 * counted from the nearest slot content an instance owns. With
 * `includeSelf`, the node itself counts when it is an instance.
 */
export function outermostInstance<Layer extends SlotLayer>(
  node: Layer,
  includeSelf: boolean,
): Layer | null {
  let found: SlotLayer | null = null
  let below: SlotLayer = node
  for (
    let current: SlotLayer | null = includeSelf ? node : node.parent;
    current && current.type !== 'PAGE' && current.type !== 'DOCUMENT';
    current = current.parent
  ) {
    if (current !== node && isOwnedSlotContent(current, below)) break
    if (current.type === 'INSTANCE') found = current
    below = current
  }
  // Every layer above a layer is a layer of the same document.
  return found as Layer | null
}
