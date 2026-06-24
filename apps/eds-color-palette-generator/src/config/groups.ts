// Fixed registry of semantic groups for the color scale.
// Groups are a closed set: steps are assigned to one of these, and can be
// reassigned, but new groups are not created at runtime. The order here is the
// canonical scale order — the header renders groups in this order, and a step's
// group determines where in the scale it belongs.

export interface PaletteGroup {
  id: string
  name: string
}

export const PALETTE_GROUPS: PaletteGroup[] = [
  { id: 'background', name: 'Background' },
  { id: 'fill-muted', name: 'Background Fill Muted' },
  { id: 'border', name: 'Border' },
  { id: 'fill-emphasis', name: 'Background Fill Emphasis' },
  { id: 'text', name: 'Text' },
]

/** Look up a group's display name by id, falling back to the raw id. */
export function getGroupName(groupId: string): string {
  return PALETTE_GROUPS.find((g) => g.id === groupId)?.name ?? groupId
}

/** Index of a group in canonical scale order (-1 if unknown). */
export function getGroupOrder(groupId: string): number {
  return PALETTE_GROUPS.findIndex((g) => g.id === groupId)
}
