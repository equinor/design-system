/**
 * The bulk selection: bindings a designer has ticked, across frames and the
 * Mapping view, with what the picker needs to know about each.
 */
import { useCallback, useState } from 'react'
import type { PickerItem } from '../mapping/picker'

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
