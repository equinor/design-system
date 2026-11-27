/**
 * Slot content an instance owns. A slot in an instance follows its main
 * component until the slot is edited in the instance; then all its content
 * gets new ids below the slot's own id (`I<instance>;<slot>;<new id>`), no
 * longer follows the main component and is not in the instance's
 * `overrides`. Content that follows the main component has the id of the
 * main component's layer after the instance's (`I<instance>;<layer>`).
 * Tested on a test page in Figma and on a pasted panel component, 2026-11-19.
 *
 * A layer a session adds to the slot keeps a plain id (`2117:515`) in that
 * session until the file is opened again; other sessions see it below the
 * slot's id. Found on 2026-11-19: text layers Convert put in a slot read as
 * the panel's in the browser that ran Convert, so the scan did not count
 * their change logs and Revert frame was not offered. Content that follows
 * the main component always has an `I` id, so a plain id in a slot of an
 * instance is owned content too.
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
  // A slot in an instance has an `I` id; a slot in a main component does not.
  if (parent.type !== 'SLOT' || !parent.id.startsWith('I')) return false
  return child.id.startsWith(`${parent.id};`) || !child.id.startsWith('I')
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

/**
 * Where `node` is among `children`, or -1. A layer a session added to a
 * slot can show another id there than in its parent's list (a plain id
 * against `I<instance>;<slot>;<id>`), and the list can hold other objects
 * for the same layers, so `indexOf` alone returned -1 when Revert put a
 * Typography instance back in a slot (test page in Figma, 2026-11-19). The
 * layer is matched by object, then by id, then by its own id part, the part
 * after the last `;`, when exactly one child has it.
 */
export function indexAmongChildren(
  children: readonly SlotLayer[],
  node: SlotLayer,
): number {
  const same = children.indexOf(node)
  if (same !== -1) return same
  const byId = children.findIndex((child) => child.id === node.id)
  if (byId !== -1) return byId
  const own = (id: string) => id.slice(id.lastIndexOf(';') + 1)
  const matches = children.flatMap((child, index) =>
    own(child.id) === own(node.id) ? [index] : [],
  )
  return matches.length === 1 ? matches[0] : -1
}
