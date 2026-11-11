/** Counting and health, shared by the scan, the window and the report. */
import { SCORED_CATEGORIES } from './types'
import type {
  BindingRecord,
  Category,
  Counts,
  EntrySummary,
  OldInstance,
  ScanSummary,
} from './types'

/** The category a record is counted in; the rule's own unless a designer has decided. */
export type CategoryOf = (record: BindingRecord) => Category

const ruleCategory: CategoryOf = (record) => record.category

export function emptyCounts(): Counts {
  return { migrated: 0, sure: 0, check: 0, none: 0, inInstance: 0, other: 0 }
}

export function addToCounts(
  counts: Counts,
  record: BindingRecord,
  categoryOf: CategoryOf = ruleCategory,
): void {
  counts[categoryOf(record)] += 1
}

export function sumCounts(all: Counts[]): Counts {
  const total = emptyCounts()
  for (const counts of all) {
    for (const key of Object.keys(total) as (keyof Counts)[]) {
      total[key] += counts[key]
    }
  }
  return total
}

/** Units that count towards health: everything except other libraries and local variables. */
export function scoredTotal(counts: Counts): number {
  return SCORED_CATEGORIES.reduce((sum, category) => sum + counts[category], 0)
}

/** migrated ÷ (migrated + sure + check + none + in instance), or null when nothing is scored. */
export function healthOf(counts: Counts): number | null {
  const total = scoredTotal(counts)
  return total === 0 ? null : counts.migrated / total
}

/** Old variables that are not migrated yet: sure, check, none and in instance. */
export function oldCount(counts: Counts): number {
  return counts.sure + counts.check + counts.none + counts.inInstance
}

export type EntryMeta = Omit<EntrySummary, 'counts' | 'health' | 'oldInstances'>

export function summariseEntries(
  entries: EntryMeta[],
  records: BindingRecord[],
  oldInstances: OldInstance[],
  categoryOf: CategoryOf = ruleCategory,
): EntrySummary[] {
  const counts = new Map(entries.map((entry) => [entry.id, emptyCounts()]))
  for (const record of records) {
    const entryCounts = counts.get(record.entryId)
    if (entryCounts) addToCounts(entryCounts, record, categoryOf)
  }
  const instancesPerEntry = new Map<string, number>()
  for (const instance of oldInstances) {
    instancesPerEntry.set(
      instance.entryId,
      (instancesPerEntry.get(instance.entryId) ?? 0) + 1,
    )
  }
  return entries.map((entry) => {
    const entryCounts = counts.get(entry.id) ?? emptyCounts()
    return {
      ...entry,
      counts: entryCounts,
      health: healthOf(entryCounts),
      oldInstances: instancesPerEntry.get(entry.id) ?? 0,
    }
  })
}

/** The totals of a scan: every entry except local main components, which are counted only on request. */
export function totalsOf(entries: EntrySummary[]): Counts {
  return sumCounts(
    entries
      .filter((entry) => entry.kind !== 'component')
      .map((entry) => entry.counts),
  )
}

/** The same scan, counted again after a designer has changed targets. */
export function recount(
  summary: ScanSummary,
  records: BindingRecord[],
  oldInstances: OldInstance[],
  categoryOf: CategoryOf,
): ScanSummary {
  const meta: EntryMeta[] = summary.entries.map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    name: entry.name,
    pageId: entry.pageId,
    pageName: entry.pageName,
    sections: entry.sections,
    nodeIds: entry.nodeIds,
    changed: entry.changed,
  }))
  const entries = summariseEntries(meta, records, oldInstances, categoryOf)
  const totals = totalsOf(entries)
  return { ...summary, entries, totals, health: healthOf(totals) }
}

/** Health as a whole percentage, for display. */
export function formatHealth(health: number | null): string {
  return health === null ? '–' : `${Math.floor(health * 100)}%`
}
