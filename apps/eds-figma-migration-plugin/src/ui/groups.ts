/** Narrows the Changes rows to some of their bindings, with the counts kept right. */
import type { MappingBinding, MappingGroup } from '../scan/mapping'

export function filterGroups(
  groups: MappingGroup[],
  keep: (binding: MappingBinding) => boolean,
): MappingGroup[] {
  return groups
    .map((group) => {
      const rows = group.rows
        .map((row) => {
          const bindings = row.bindings.filter(keep)
          return { ...row, bindings, count: bindings.length }
        })
        .filter((row) => row.count > 0)
      return {
        ...group,
        rows,
        count: rows.reduce((sum, row) => sum + row.count, 0),
      }
    })
    .filter((group) => group.count > 0)
}
