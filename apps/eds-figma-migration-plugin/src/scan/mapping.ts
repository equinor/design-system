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
import type { OverrideChange } from '../shared/messages'

/**
 * The choice that leaves a value for a later run: Apply does not change it,
 * and it keeps counting as not migrated, so health reaches 100% only once no
 * legacy variable is left. There is no choice that keeps a legacy variable
 * for good (decided 2026-11-16).
 */
export const DECIDE_LATER = 'decide-later'

/** A chosen target: a variable, text style, mode, literal or reset, or DECIDE_LATER. */
export type OverrideValue = string

export type Overrides = {
  /** By record id, from the inspector */
  records: Record<string, OverrideValue>
  /** By mapping row key, from the Mapping view */
  rows: Record<string, OverrideValue>
}

export const NO_OVERRIDES: Overrides = { records: {}, rows: {} }

/**
 * The choices as the file stores them. Earlier versions stored null for a
 * value whose legacy variable was kept (Excluded); that choice is gone, so
 * such a value is read as Decide later. Anything that is not a string is
 * left out.
 */
export function savedChoices(saved: unknown): Overrides {
  const read = (map: unknown): Record<string, OverrideValue> => {
    const result: Record<string, OverrideValue> = {}
    if (!map || typeof map !== 'object') return result
    for (const [key, value] of Object.entries(map)) {
      if (typeof value === 'string') result[key] = value
      else if (value === null) result[key] = DECIDE_LATER
    }
    return result
  }
  if (!saved || typeof saved !== 'object') return { records: {}, rows: {} }
  const { records, rows } = saved as { records?: unknown; rows?: unknown }
  if (!records || !rows) return { records: {}, rows: {} }
  return { records: read(records), rows: read(rows) }
}

/** Categories the Mapping view lists: the ones a designer can still decide on. */
const MAPPED: BindingRecord['category'][] = ['sure', 'check', 'none']

/**
 * Whether a designer can decide on the binding. A Manual fix counts when the
 * plugin can make it: it is accepted in Review, never applied without that.
 */
export function isMappable(record: BindingRecord): boolean {
  if (record.oldKey === undefined) return false
  if (record.category === 'byHand') return (record.candidates?.length ?? 0) > 0
  return MAPPED.includes(record.category)
}

/** The key of the mapping row a record belongs to. */
export function rowKey(record: BindingRecord): string {
  return `${record.oldKey ?? record.id}|${record.candidates?.[0] ?? ''}|${record.category}`
}

export type EffectiveTarget = {
  /** The target name, DECIDE_LATER, or null when the rule has no proposal */
  target: string | null
  source: 'proposal' | 'row' | 'record'
}

/**
 * True while a value waits for a designer: nobody has chosen a target, or
 * they chose Decide later. Review lists it, and its reason stays in view.
 */
export function isUndecided(target: EffectiveTarget): boolean {
  return target.source === 'proposal' || target.target === DECIDE_LATER
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
 * whatever the rule said. No equivalent stays for values the rules have
 * nothing for, so a designer's choice is never shown as a gap in the EDS
 * Beta. Without a choice, the rule's category stands, and so it does with
 * Decide later, except that a Ready value becomes Needs check: it waits for
 * a designer, and Apply leaves it.
 */
export function categoryAfter(
  category: Category,
  target: EffectiveTarget,
): Category {
  if (target.source === 'proposal') return category
  if (target.target === DECIDE_LATER) {
    return category === 'sure' ? 'check' : category
  }
  return 'sure'
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
  /** Inside an instance, which overrides the value itself */
  override?: true
  /**
   * For a Manual fix: how to fix this layer, which differs per layer. With
   * `ownReasons`, also the binding's own reason when it differs from the
   * row's, such as a text case a Typography conversion drops.
   */
  reason?: string
}

export type MappingRow = {
  key: string
  /** The rule's outcome, or byHand for a Manual fix */
  outcome: Outcome | 'byHand'
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

/**
 * Groups the bindings still to migrate by legacy variable, most used first.
 * The row's reason is its first binding's. With `ownReasons`, a binding
 * whose reason differs keeps its own, for the Typography tab, where one
 * instance in a row can have a text case the others do not.
 */
export function buildMappingGroups(
  records: BindingRecord[],
  { ownReasons = false }: { ownReasons?: boolean } = {},
): MappingGroup[] {
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
        outcome: record.category as MappingRow['outcome'],
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
      ...(record.override ? { override: true as const } : {}),
      ...((record.category === 'byHand' ||
        (ownReasons && record.reason !== row.reason)) &&
      record.reason
        ? { reason: record.reason }
        : {}),
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

/** The values in a row with a choice of their own, which wins over the row's. */
export function ownChoices(row: MappingRow, overrides: Overrides): number {
  return row.bindings.filter((binding) => binding.id in overrides.records)
    .length
}

/** The target every value in the row gets, or undefined when they differ. */
export function rowCurrent(
  row: MappingRow,
  overrides: Overrides,
): EffectiveTarget['target'] | undefined {
  const targets = new Set(
    row.bindings.map(
      (binding) => bindingOutcome(row, binding, overrides).target,
    ),
  )
  return targets.size === 1 ? [...targets][0] : undefined
}

/**
 * The changes a choice on a row makes. It reaches every value in the row, so
 * it also removes the choices made on single values there, such as the ones
 * Review saves: otherwise those win, and the row's change shows nowhere.
 * Undefined undoes the row's change and those choices.
 */
export function rowChoiceChanges(
  row: MappingRow,
  value: OverrideValue | undefined,
  overrides: Overrides,
): OverrideChange[] {
  return [
    {
      target: { type: 'row', key: row.key },
      // Choosing the proposal again on a Ready row is no change; on a row
      // that needs a check, it settles the row.
      value:
        value === row.proposal && row.outcome === 'sure' ? undefined : value,
    },
    ...row.bindings
      .filter((binding) => binding.id in overrides.records)
      .map((binding): OverrideChange => ({
        target: { type: 'record', id: binding.id },
      })),
  ]
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
