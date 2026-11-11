/** Counting and health, shared by the scan, the window and the report. */
import { SCORED_CATEGORIES } from './types'
import type { BindingRecord, Counts, EntrySummary, OldInstance } from './types'

export function emptyCounts(): Counts {
  return { migrated: 0, sure: 0, check: 0, none: 0, inInstance: 0, other: 0 }
}

export function addToCounts(counts: Counts, record: BindingRecord): void {
  counts[record.category] += 1
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
): EntrySummary[] {
  const counts = new Map(entries.map((entry) => [entry.id, emptyCounts()]))
  for (const record of records) {
    const entryCounts = counts.get(record.entryId)
    if (entryCounts) addToCounts(entryCounts, record)
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

/** Health as a whole percentage, for display. */
export function formatHealth(health: number | null): string {
  return health === null ? '–' : `${Math.floor(health * 100)}%`
}
