/**
 * The bulk selection: bindings a designer has ticked, across frames and the
 * Mapping view, with what the picker needs to know about each.
 */
import { useCallback, useState } from 'react'
import type { PickerItem } from '../mapping/picker'
import { bindingOutcome } from '../scan/mapping'
import type { MappingGroup, Overrides } from '../scan/mapping'

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
 * own, which Reset choices removes, and the frames they are in.
 */
export function selectionStatus(
  ids: Iterable<string>,
  groups: MappingGroup[],
  overrides: Overrides,
): { ready: number; chosen: number; entryIds: string[] } {
  const wanted = new Set(ids)
  const entryIds = new Set<string>()
  let ready = 0
  for (const group of groups) {
    for (const row of group.rows) {
      for (const binding of row.bindings) {
        if (!wanted.has(binding.id)) continue
        entryIds.add(binding.entryId)
        if (bindingOutcome(row, binding, overrides).category === 'sure') {
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
