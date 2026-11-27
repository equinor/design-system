/**
 * The bulk selection: bindings a designer has ticked, across frames and the
 * Mapping view, with what the picker needs to know about each.
 */
import { useCallback, useState } from 'react'
import type { PickerItem } from '../mapping/picker'
import { bindingOutcome, NO_KEPT_MODES } from '../scan/mapping'
import type { KeptModes, MappingGroup, Overrides } from '../scan/mapping'

export type SelectedBinding = PickerItem & { id: string }

export type Selection = {
  items: Map<string, SelectedBinding>
  has: (id: string) => boolean
  /** Ticks or unticks several bindings at once */
  set: (bindings: SelectedBinding[], selected: boolean) => void
  clear: () => void
}

export function useSelection(): Selection {
  const [items, setItems] = useState<Map<string, SelectedBinding>>(new Map())
  const set = useCallback((bindings: SelectedBinding[], selected: boolean) => {
    setItems((previous) => {
      const next = new Map(previous)
      for (const binding of bindings) {
        if (selected) next.set(binding.id, binding)
        else next.delete(binding.id)
      }
      return next
    })
  }, [])
  const clear = useCallback(() => setItems(new Map()), [])
  return { items, has: (id) => items.has(id), set, clear }
}

/**
 * What the bulk bar says about the selected bindings: how many are Ready
 * after the choices, which Apply changes, how many have a choice of their
 * own, which Reset choices removes, and the frames they are in. A legacy
 * mode the next Apply keeps (`kept`) is Waiting, not Ready. A mode Apply on
 * the selected values keeps because a value below it is not selected is
 * counted in the confirmation, from the plugin's preview.
 */
export function selectionStatus(
  ids: Iterable<string>,
  groups: MappingGroup[],
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): { ready: number; chosen: number; entryIds: string[] } {
  const wanted = new Set(ids)
  const entryIds = new Set<string>()
  let ready = 0
  for (const group of groups) {
    for (const row of group.rows) {
      for (const binding of row.bindings) {
        if (!wanted.has(binding.id)) continue
        entryIds.add(binding.entryId)
        if (bindingOutcome(row, binding, overrides, kept).category === 'sure') {
          ready += 1
        }
      }
    }
  }
  const chosen = [...wanted].filter((id) => id in overrides.records).length
  return { ready, chosen, entryIds: [...entryIds] }
}

/** The state of a checkbox that ticks a group of bindings. */
export function groupState(
  selection: Selection,
  ids: string[],
): { checked: boolean; indeterminate: boolean } {
  const ticked = ids.filter((id) => selection.has(id)).length
  return {
    checked: ids.length > 0 && ticked === ids.length,
    indeterminate: ticked > 0 && ticked < ids.length,
  }
}
