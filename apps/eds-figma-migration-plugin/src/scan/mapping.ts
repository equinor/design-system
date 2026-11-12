/**
 * The Mapping view and overrides: every binding still to migrate, grouped by
 * the legacy variable it uses, and the targets a designer chose instead of
 * the proposal.
 *
 * A group is one legacy variable. The same variable can get different
 * proposals in different places (a border on a card and on a button), so a
 * group has one row per proposal and outcome. A designer can change the
 * target of a row, which changes it for every binding in the row, or of a
 * single binding in the inspector, which wins over the row.
 */
import type { BindingKind, Outcome } from '../mapping/types'
import type { ColorScheme } from '../mapping/scheme'
import type { BindingRecord, Category, Density, PropertyGroup } from './types'

/** A chosen target, or null to leave the legacy binding as it is. */
export type OverrideValue = string | null

export type Overrides = {
  /** By record id, from the inspector */
  records: Record<string, OverrideValue>
  /** By mapping row key, from the Mapping view */
  rows: Record<string, OverrideValue>
}

export const NO_OVERRIDES: Overrides = { records: {}, rows: {} }

/** Categories the Mapping view lists: the ones a designer can still decide on. */
const MAPPED: BindingRecord['category'][] = ['sure', 'check', 'none']

export function isMappable(record: BindingRecord): boolean {
  return MAPPED.includes(record.category) && record.oldKey !== undefined
}

/** The key of the mapping row a record belongs to. */
export function rowKey(record: BindingRecord): string {
  return `${record.oldKey ?? record.id}|${record.candidates?.[0] ?? ''}|${record.category}`
}

export type EffectiveTarget = {
  /** The target name, or null to leave the binding */
  target: string | null
  source: 'proposal' | 'row' | 'record'
}

/** The target that will be applied: the binding's own override, then its row's, then the proposal. */
export function resolveTarget(
  id: string,
  key: string,
  proposal: string | undefined,
  overrides: Overrides,
): EffectiveTarget {
  if (id in overrides.records) {
    return { target: overrides.records[id], source: 'record' }
  }
  if (key in overrides.rows) {
    return { target: overrides.rows[key], source: 'row' }
  }
  return { target: proposal ?? null, source: 'proposal' }
}

export function effectiveTarget(
  record: BindingRecord,
  overrides: Overrides,
): EffectiveTarget {
  return resolveTarget(
    record.id,
    rowKey(record),
    record.candidates?.[0],
    overrides,
  )
}

/**
 * The category once a designer has decided: a target they chose is Ready,
 * whatever the rule said, and a choice to leave the binding is No
 * equivalent. Without a choice, the rule's category stands.
 */
export function categoryAfter(
  category: Category,
  target: EffectiveTarget,
): Category {
  if (target.source === 'proposal') return category
  return target.target === null ? 'none' : 'sure'
}

export function effectiveCategory(
  record: BindingRecord,
  overrides: Overrides,
): Category {
  return isMappable(record)
    ? categoryAfter(record.category, effectiveTarget(record, overrides))
    : record.category
}

/** One binding in a mapping row, enough to list and select it. */
export type MappingBinding = {
  id: string
  nodeId: string
  nodeName: string
  entryId: string
  /** Layer names from the entry down to the layer's parent */
  path: string[]
  /** The number the legacy variable resolves to on the layer, in px */
  oldValue?: number
  /** The colour the legacy variable resolves to on the layer */
  oldColour?: string
  /** The density the layer has after the migration */
  density?: Density
  /** The colour scheme the layer has after the migration */
  scheme?: ColorScheme
  property: BindingRecord['property']
  kind?: BindingKind
}

export type MappingRow = {
  key: string
  outcome: Outcome
  proposal?: string
  candidates: string[]
  /** One reason, from the first binding in the row */
  reason?: string
  /** The rule that decided the row, such as mode/kept */
  rule?: string
  count: number
  kind?: BindingKind
  bindings: MappingBinding[]
}

export type MappingGroup = {
  /** The legacy variable, typography set or mode */
  oldKey: string
  old: string
  oldCollection?: string
  group: PropertyGroup
  count: number
  rows: MappingRow[]
}

/** Groups the bindings still to migrate by legacy variable, most used first. */
export function buildMappingGroups(records: BindingRecord[]): MappingGroup[] {
  const groups = new Map<string, MappingGroup>()
  const rows = new Map<string, MappingRow>()
  for (const record of records) {
    if (!isMappable(record) || !record.oldKey) continue
    let group = groups.get(record.oldKey)
    if (!group) {
      group = {
        oldKey: record.oldKey,
        old: record.old ?? record.oldKey,
        oldCollection: record.oldCollection,
        group: record.group,
        count: 0,
        rows: [],
      }
      groups.set(record.oldKey, group)
    }
    group.count += 1
    const key = rowKey(record)
    let row = rows.get(key)
    if (!row) {
      row = {
        key,
        outcome: record.category as Outcome,
        proposal: record.candidates?.[0],
        candidates: record.candidates ?? [],
        reason: record.reason,
        rule: record.rule,
        count: 0,
        kind: record.kind,
        bindings: [],
      }
      rows.set(key, row)
      group.rows.push(row)
    }
    row.count += 1
    row.bindings.push({
      id: record.id,
      nodeId: record.nodeId,
      nodeName: record.nodeName,
      entryId: record.entryId,
      path: record.path,
      ...(record.oldValue !== undefined ? { oldValue: record.oldValue } : {}),
      ...(record.oldColour !== undefined
        ? { oldColour: record.oldColour }
        : {}),
      ...(record.density ? { density: record.density } : {}),
      ...(record.scheme ? { scheme: record.scheme } : {}),
      property: record.property,
      kind: record.kind,
    })
  }
  for (const group of groups.values()) {
    group.rows.sort((a, b) => b.count - a.count)
  }
  return [...groups.values()].sort(
    (a, b) => b.count - a.count || a.old.localeCompare(b.old, 'en'),
  )
}

/** A legacy mode kept because values below still read it. */
export function isHeldMode(rule: string | undefined): boolean {
  return rule === 'mode/kept' || rule === 'mode/after-review'
}

/** What one binding in a row gets, after the designer's choices. */
export type BindingOutcome = EffectiveTarget & { category: Category }

export function bindingOutcome(
  row: MappingRow,
  binding: MappingBinding,
  overrides: Overrides,
): BindingOutcome {
  const target = resolveTarget(binding.id, row.key, row.proposal, overrides)
  return { ...target, category: categoryAfter(row.outcome, target) }
}

/** How many bindings get each target, most first. */
export type TargetCount = {
  target: string | null
  /** True when nothing changes: no equivalent, or a legacy mode that is kept, and nobody chose anything */
  noEquivalent: boolean
  /** Why nothing changes, such as mode/kept */
  rule?: string
  count: number
}

export function targetCounts(
  rows: MappingRow[],
  overrides: Overrides,
): TargetCount[] {
  const counts = new Map<string, TargetCount>()
  for (const row of rows) {
    for (const binding of row.bindings) {
      const outcome = bindingOutcome(row, binding, overrides)
      const noEquivalent =
        row.outcome === 'none' && outcome.source === 'proposal'
      const key = `${outcome.target}|${noEquivalent}`
      const entry = counts.get(key) ?? {
        target: outcome.target,
        noEquivalent,
        ...(noEquivalent && row.rule ? { rule: row.rule } : {}),
        count: 0,
      }
      entry.count += 1
      counts.set(key, entry)
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)
}
