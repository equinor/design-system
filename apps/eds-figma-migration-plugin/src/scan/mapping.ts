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
  /**
   * The choices on single values that a change on a row replaced, by row
   * key and then record id, so Undo my change on the row brings them back
   * (withRowChoice). Left out when there are none.
   */
  replaced?: Record<string, Record<string, OverrideValue>>
}

export const NO_OVERRIDES: Overrides = { records: {}, rows: {} }

/**
 * The choices as the file stores them. Earlier versions stored null for a
 * value whose legacy variable was kept (Excluded); that choice is gone, so
 * such a value is read as Decide later. Anything that is not a string is
 * left out.
 *
 * Earlier versions also removed a legacy mode the rules keep (Waiting) when
 * a designer chose clearing it, whatever read it below. That choice is now
 * REMOVE_ANYWAY (scan/classify.ts). A stored clearing is kept as it is,
 * since the stored choices do not say whether the mode was held, and it now
 * clears the mode once nothing below reads it.
 *
 * The choices a change on a row replaced (`replaced`) are read the same way,
 * row by row. Choices saved before there were any have none, and a row
 * without a choice to bring back is left out.
 */
export function savedChoices(saved: unknown): Overrides {
  const isMap = (map: unknown): map is object =>
    !!map && typeof map === 'object' && !Array.isArray(map)
  const read = (map: unknown): Record<string, OverrideValue> => {
    const result: Record<string, OverrideValue> = {}
    if (!isMap(map)) return result
    for (const [key, value] of Object.entries(map)) {
      if (typeof value === 'string') result[key] = value
      else if (value === null) result[key] = DECIDE_LATER
    }
    return result
  }
  if (!isMap(saved)) return { records: {}, rows: {} }
  const { records, rows, replaced } = saved as {
    records?: unknown
    rows?: unknown
    replaced?: unknown
  }
  if (!records || !rows) return { records: {}, rows: {} }
  const stashes: Record<string, Record<string, OverrideValue>> = {}
  if (isMap(replaced)) {
    for (const [key, stash] of Object.entries(replaced)) {
      const choices = read(stash)
      if (Object.keys(choices).length > 0) stashes[key] = choices
    }
  }
  return {
    records: read(records),
    rows: read(rows),
    ...(Object.keys(stashes).length > 0 ? { replaced: stashes } : {}),
  }
}

/**
 * The choices after changes on single values (the set-overrides message):
 * a value sets a choice, undefined removes it. The choices a change on a row
 * replaced stay put aside, so Undo my change on that row still brings them
 * back, except on a value that has a choice of its own again.
 */
export function withChanges(
  overrides: Overrides,
  changes: OverrideChange[],
): Overrides {
  const records = { ...overrides.records }
  const rows = { ...overrides.rows }
  for (const { target, value } of changes) {
    const map = target.type === 'record' ? records : rows
    const key = target.type === 'record' ? target.id : target.key
    if (value === undefined) delete map[key]
    else map[key] = value
  }
  return { ...overrides, records, rows }
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

/**
 * A legacy mode the next Apply keeps, because values below it that read it
 * are not changed in that run (apply-plan.ts, keptModes). It depends on the
 * designer's choices, such as a value below set to Decide later, so the
 * plugin works the kept modes out again with every count and sends them to
 * the window with it.
 */
export type KeptMode = {
  /**
   * True when the run sets a new mode and the legacy mode stays beside it,
   * which keeps the mode Ready. False for a legacy mode that is only
   * cleared: the run changes nothing there, so it waits (Waiting).
   */
  setsMode: boolean
  /**
   * What the legacy mode waits for, written to follow "once" or "until",
   * such as "Icon, width is decided" or "the main component Button is
   * migrated"
   */
  waitsFor: string
}

/** The legacy modes the next Apply keeps, by record id. */
export type KeptModes = Record<string, KeptMode>

export const NO_KEPT_MODES: KeptModes = {}

/**
 * True for a legacy mode that is only cleared and that the next Apply
 * keeps. It waits for the values below it, and counts as No equivalent
 * (Waiting) instead of Ready, so the Ready count is what the run changes.
 */
export function isKeptWaiting(id: string, kept: KeptModes): boolean {
  return kept[id] !== undefined && !kept[id].setsMode
}

/** What a kept legacy mode says on its row: when it is cleared, or what stays beside the new mode. */
export function keptModeText(kept: KeptMode): string {
  return kept.setsMode
    ? `The legacy mode stays beside it until ${kept.waitsFor}.`
    : `Cleared once ${kept.waitsFor}.`
}

/**
 * The category once a designer has decided (categoryAfter). With the kept
 * modes, a Ready legacy mode that the next Apply only keeps counts as No
 * equivalent, shown as Waiting.
 */
export function effectiveCategory(
  record: BindingRecord,
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): Category {
  const category = isMappable(record)
    ? categoryAfter(record.category, effectiveTarget(record, overrides))
    : record.category
  return category === 'sure' && isKeptWaiting(record.id, kept)
    ? 'none'
    : category
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
  /** For legacy typography: what the rules read from it (BindingRecord.oldTypography) */
  oldTypography?: string
  /** The density the layer has after the migration */
  density?: Density
  /** The colour scheme the layer has after the migration */
  scheme?: ColorScheme
  property: BindingRecord['property']
  kind?: BindingKind
  /** Inside an instance, which overrides the value itself */
  override?: true
  /** The layer or a layer above it is hidden (RawUnit.hidden) */
  hidden?: true
  /**
   * For a Manual fix: how to fix this layer, which differs per layer. With
   * `ownReasons`, also the binding's own reason when it differs from the
   * row's, such as a text case a Typography conversion drops.
   */
  reason?: string
  /** For a Manual fix: what resetting this layer also removes and sets again (BindingRecord.resetEffects) */
  resetEffects?: string[]
}

export type MappingRow = {
  key: string
  /** The rule's outcome, or byHand for a Manual fix */
  outcome: Outcome | 'byHand'
  proposal?: string
  candidates: string[]
  /** One reason, from the first binding in the row */
  reason?: string
  /** The rule that decided the row, such as number/as-px */
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
      ...(record.oldTypography ? { oldTypography: record.oldTypography } : {}),
      ...(record.density ? { density: record.density } : {}),
      ...(record.scheme ? { scheme: record.scheme } : {}),
      property: record.property,
      kind: record.kind,
      ...(record.override ? { override: true as const } : {}),
      ...(record.hidden ? { hidden: true as const } : {}),
      ...((record.category === 'byHand' ||
        (ownReasons && record.reason !== row.reason)) &&
      record.reason
        ? { reason: record.reason }
        : {}),
      ...(record.category === 'byHand' && record.resetEffects
        ? { resetEffects: record.resetEffects }
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

/**
 * The rows of Changes narrowed to the values in some entries, such as the
 * main components on the Main components tab or one open frame. Rows and
 * groups left without a value are dropped, and their counts are those of
 * the values kept. Everything else on a row stays as it is, its key above
 * all, so the choices stored by row key apply to the narrowed rows too. The
 * order is that of Changes, which Review follows as well.
 */
export function filterGroups(
  groups: MappingGroup[],
  entryIds: ReadonlySet<string>,
): MappingGroup[] {
  return groups
    .map((group) => {
      const rows = group.rows
        .map((row) => {
          const bindings = row.bindings.filter((binding) =>
            entryIds.has(binding.entryId),
          )
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

/**
 * The row as Changes lists it, with every value in it, for a row that
 * filterGroups has narrowed: the row in `groups` with the same key and its
 * first value. A choice on a row is stored by its key, so it reaches every
 * value in the row, also those the narrowed row leaves out. A row that is
 * not in `groups`, such as a Typography conversion, is returned as it is.
 */
export function wholeRow(groups: MappingGroup[], row: MappingRow): MappingRow {
  const first = row.bindings[0]?.id
  for (const group of groups) {
    for (const candidate of group.rows) {
      if (
        candidate.key === row.key &&
        candidate.bindings.some((binding) => binding.id === first)
      ) {
        return candidate
      }
    }
  }
  return row
}

/**
 * The values in the groups that are Ready after the designer's choices,
 * with a legacy mode the next Apply keeps counted as Waiting: the changes
 * an Apply on the entries of these values makes. On the Main components
 * tab, the count in the footer.
 */
export function readyCount(
  groups: MappingGroup[],
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): number {
  let ready = 0
  for (const group of groups) {
    for (const row of group.rows) {
      for (const binding of row.bindings) {
        if (bindingOutcome(row, binding, overrides, kept).category === 'sure') {
          ready += 1
        }
      }
    }
  }
  return ready
}

/** What one binding in a row gets, after the designer's choices. */
export type BindingOutcome = EffectiveTarget & {
  category: Category
  /**
   * A legacy mode that is only cleared and that the next Apply keeps,
   * because values below it that read it are not changed in that run. It
   * waits for them, shown as Waiting.
   */
  held?: true
  /** For a legacy mode the next Apply keeps: what it waits for */
  kept?: KeptMode
}

export function bindingOutcome(
  row: MappingRow,
  binding: MappingBinding,
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): BindingOutcome {
  const target = resolveTarget(binding.id, row.key, row.proposal, overrides)
  const after = categoryAfter(row.outcome, target)
  const keep = kept[binding.id]
  const waiting = after === 'sure' && isKeptWaiting(binding.id, kept)
  const category = waiting ? 'none' : after
  return {
    ...target,
    category,
    ...(waiting ? { held: true as const } : {}),
    ...(keep ? { kept: keep } : {}),
  }
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
 * The row a choice is made on, as the window sends it to the plugin (the
 * row-choice message): its key, every value in it across the scope
 * (wholeRow), and the proposal and outcome the rule gave it.
 */
export type RowChoiceTarget = {
  key: string
  bindingIds: string[]
  proposal?: string
  outcome: MappingRow['outcome']
}

export function rowChoiceTarget(row: MappingRow): RowChoiceTarget {
  return {
    key: row.key,
    bindingIds: row.bindings.map((binding) => binding.id),
    ...(row.proposal !== undefined ? { proposal: row.proposal } : {}),
    outcome: row.outcome,
  }
}

/** The choices as stored, leaving `replaced` out when no row has choices put aside. */
function choicesOf(
  records: Overrides['records'],
  rows: Overrides['rows'],
  replaced: NonNullable<Overrides['replaced']>,
): Overrides {
  return Object.keys(replaced).length > 0
    ? { records, rows, replaced }
    : { records, rows }
}

/**
 * The choices once a change on the row has removed the choices on its
 * values and put them aside under the row's key. Choices put aside by an
 * earlier change on the row are kept: a value put aside then keeps the
 * choice it had then, and its choice since is dropped.
 */
function putAside(overrides: Overrides, row: RowChoiceTarget): Overrides {
  const records = { ...overrides.records }
  const replaced = { ...overrides.replaced }
  const stash = { ...replaced[row.key] }
  for (const id of row.bindingIds) {
    if (!(id in records)) continue
    if (!(id in stash)) stash[id] = records[id]
    delete records[id]
  }
  if (Object.keys(stash).length > 0) replaced[row.key] = stash
  return choicesOf(records, overrides.rows, replaced)
}

/**
 * The choices after a choice on a row, made in one step by the plugin. A
 * target reaches every value in the row, so it also removes the choices made
 * on single values there, such as the ones Review saves: otherwise those
 * win, and the row's change shows nowhere. They are put aside under the
 * row's key (`replaced`).
 *
 * Undefined undoes the change on the row: the row's choice goes, and the
 * choices put aside come back, except on a value that has a choice of its
 * own again, made after the change on the row, which is kept. Nothing stays
 * put aside for the row after that.
 */
export function withRowChoice(
  overrides: Overrides,
  row: RowChoiceTarget,
  value: OverrideValue | undefined,
): Overrides {
  if (value === undefined) {
    const records = { ...overrides.records }
    const rows = { ...overrides.rows }
    const { [row.key]: stash = {}, ...replaced } = overrides.replaced ?? {}
    delete rows[row.key]
    for (const [id, choice] of Object.entries(stash)) {
      if (!(id in records)) records[id] = choice
    }
    return choicesOf(records, rows, replaced)
  }
  const aside = putAside(overrides, row)
  const rows = { ...aside.rows }
  // Choosing the proposal again on a Ready row is no change, so no choice
  // is stored on the row; the choices on its values are put aside all the
  // same. On a row that needs a check, the proposal settles the row. Saving
  // the choice the row has already keeps it.
  const noChange =
    value === row.proposal &&
    row.outcome === 'sure' &&
    overrides.rows[row.key] !== value
  if (noChange) delete rows[row.key]
  else rows[row.key] = value
  return { ...aside, rows }
}

/**
 * How many choices on single values Undo my change on the row brings back:
 * the ones changes on the row replaced, except on values that have a choice
 * of their own again, which Undo keeps.
 */
export function choicesToBringBack(overrides: Overrides, key: string): number {
  return Object.keys(overrides.replaced?.[key] ?? {}).filter(
    (id) => !(id in overrides.records),
  ).length
}

/**
 * How many choices Undo my change on the row brings back once a target
 * chosen on the row now has replaced the choices on its values.
 */
export function choicesToBringBackAfter(
  overrides: Overrides,
  row: RowChoiceTarget,
): number {
  return choicesToBringBack(putAside(overrides, row), row.key)
}

/** How many bindings get each target, most first. */
export type TargetCount = {
  target: string | null
  /** True when nothing changes: no equivalent, and nobody chose anything */
  noEquivalent: boolean
  /** The rule that found no equivalent, such as number/as-px or other/type */
  rule?: string
  /** A Ready legacy mode the next Apply keeps, because values below it wait (isKeptWaiting) */
  kept?: true
  count: number
}

export function targetCounts(
  rows: MappingRow[],
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): TargetCount[] {
  const counts = new Map<string, TargetCount>()
  for (const row of rows) {
    for (const binding of row.bindings) {
      const outcome = bindingOutcome(row, binding, overrides, kept)
      const noEquivalent =
        row.outcome === 'none' && outcome.source === 'proposal'
      const waits = outcome.held === true && outcome.kept?.setsMode === false
      const key = `${outcome.target}|${noEquivalent}|${waits}`
      const entry = counts.get(key) ?? {
        target: outcome.target,
        noEquivalent,
        ...(noEquivalent && row.rule ? { rule: row.rule } : {}),
        ...(waits ? { kept: true as const } : {}),
        count: 0,
      }
      entry.count += 1
      counts.set(key, entry)
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)
}
