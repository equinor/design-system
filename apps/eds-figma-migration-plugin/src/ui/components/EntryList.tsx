import { Button, Icon } from '@equinor/eds-core-react/next'
import { arrow_forward } from '@equinor/eds-icons'
import { formatHealth, oldCount } from '../../scan/summary'
import type { EntrySummary } from '../../scan/types'
import { HealthBar } from './HealthBar'

type EntryListProps = {
  entries: EntrySummary[]
  /** Show the page name in group headings, for a scan of the whole file */
  showPages: boolean
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
}

type Group = { key: string; title: string; entries: EntrySummary[] }

/** Lowest health first; entries with nothing to score last. */
function byHealth(a: EntrySummary, b: EntrySummary): number {
  if (a.health === null && b.health === null)
    return a.name.localeCompare(b.name)
  if (a.health === null) return 1
  if (b.health === null) return -1
  return a.health - b.health
}

function groupEntries(entries: EntrySummary[], showPages: boolean): Group[] {
  const groups = new Map<string, Group>()
  for (const entry of entries) {
    const key = `${entry.pageId}|${entry.sections.join(' / ')}`
    const parts = [...(showPages ? [entry.pageName] : []), ...entry.sections]
    let group = groups.get(key)
    if (!group) {
      group = { key, title: parts.join(' / '), entries: [] }
      groups.set(key, group)
    }
    group.entries.push(entry)
  }
  return [...groups.values()].map((group) => ({
    ...group,
    entries: [...group.entries].sort(byHealth),
  }))
}

function countsText(entry: EntrySummary): string {
  const { counts } = entry
  const parts = [`${counts.migrated} migrated`, `${oldCount(counts)} old`]
  if (counts.check > 0) parts.push(`${counts.check} ⚠`)
  if (entry.oldInstances > 0) {
    parts.push(
      `${entry.oldInstances} old instance${entry.oldInstances === 1 ? '' : 's'}`,
    )
  }
  return parts.join(' · ')
}

/**
 * The frames in the scan, grouped by page and section. The Beta has no list
 * or table component, so the rows are built here (BETA-GAPS.md).
 */
export function EntryList({
  entries,
  showPages,
  onOpen,
  onGoTo,
}: EntryListProps) {
  const groups = groupEntries(entries, showPages)
  return (
    <div className="entry-groups">
      {groups.map((group) => (
        <section
          key={group.key}
          className="entry-group"
          aria-label={group.title || 'Frames'}
        >
          {group.title && <h3 className="group-title">{group.title}</h3>}
          <ul className="entry-list">
            {group.entries.map((entry) => (
              <li key={entry.id} className="entry-row">
                <button
                  type="button"
                  className="entry-open"
                  onClick={() => onOpen(entry)}
                >
                  <span className="entry-name">{entry.name}</span>
                  <span className="entry-meta">{countsText(entry)}</span>
                </button>
                <HealthBar counts={entry.counts} size="small" />
                <span className="entry-health">
                  {formatHealth(entry.health)}
                </span>
                <Button
                  icon
                  variant="ghost"
                  size="small"
                  aria-label={`Go to ${entry.name}`}
                  onClick={() => onGoTo(entry)}
                >
                  <Icon data={arrow_forward} size="md" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
