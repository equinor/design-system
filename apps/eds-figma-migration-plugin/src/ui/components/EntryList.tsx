import { Fragment } from 'react'
import { Button } from '@equinor/eds-core-react/next'
import { formatHealth, oldCount } from '../../scan/summary'
import type { EntryKind, EntrySummary } from '../../scan/types'
import { HealthBar } from './HealthBar'

type EntryListProps = {
  entries: EntrySummary[]
  /** Show the page in group headings, for a scan of the whole file */
  showPages: boolean
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
}

type Group = {
  key: string
  pageId: string
  page: string
  sections: string[]
  entries: EntrySummary[]
}

/** The kind shown before a row's name. Loose layers on a page or in a section are named for what they are already. */
function kindLabel(entry: EntrySummary): string | undefined {
  const labels: Record<EntryKind, string | undefined> = {
    frame: 'Frame',
    loose: entry.id.startsWith('loose:') ? undefined : 'Layer',
    component: 'Component',
  }
  return labels[entry.kind]
}

/** Lowest health first; entries with nothing to score last. */
function byHealth(a: EntrySummary, b: EntrySummary): number {
  if (a.health === null && b.health === null) {
    return a.name.localeCompare(b.name)
  }
  if (a.health === null) return 1
  if (b.health === null) return -1
  return a.health - b.health
}

function groupEntries(entries: EntrySummary[]): Group[] {
  const groups = new Map<string, Group>()
  for (const entry of entries) {
    const key = `${entry.pageId}|${entry.sections.join(' / ')}`
    let group = groups.get(key)
    if (!group) {
      group = {
        key,
        pageId: entry.pageId,
        page: entry.pageName,
        sections: entry.sections,
        entries: [],
      }
      groups.set(key, group)
    }
    group.entries.push(entry)
  }
  // Pages keep their order; on each page, the layers directly on the page
  // come before the sections, so the page heading is above its sections.
  const pageOrder = [...new Set(entries.map((entry) => entry.pageId))]
  return [...groups.values()]
    .sort(
      (a, b) =>
        pageOrder.indexOf(a.pageId) - pageOrder.indexOf(b.pageId) ||
        Number(a.sections.length > 0) - Number(b.sections.length > 0),
    )
    .map((group) => ({
      ...group,
      entries: [...group.entries].sort(byHealth),
    }))
}

function countsText(entry: EntrySummary): string {
  const { counts } = entry
  const parts = [`${counts.migrated} migrated`, `${oldCount(counts)} legacy`]
  if (counts.check > 0) parts.push(`${counts.check} need check`)
  if (entry.oldInstances > 0) {
    parts.push(
      `${entry.oldInstances} legacy instance${entry.oldInstances === 1 ? '' : 's'}`,
    )
  }
  return parts.join(' · ')
}

/** “Page · Name”, then “Section · Name” for each section the entries are in. */
function GroupTitle({ group, showPage }: { group: Group; showPage: boolean }) {
  const parts: [string, string][] = []
  if (showPage || group.sections.length === 0) parts.push(['Page', group.page])
  for (const section of group.sections) parts.push(['Section', section])
  return (
    <h3 className="group-title">
      {parts.map(([kind, name], index) => (
        <Fragment key={`${kind}-${name}`}>
          {index > 0 && <span aria-hidden="true"> › </span>}
          <span className="kind-label">{kind}</span> {name}
        </Fragment>
      ))}
    </h3>
  )
}

/**
 * The entries in the scan, grouped by page and section. The Beta has no list
 * or table component, so the rows are built here (BETA-GAPS.md).
 */
export function EntryList({
  entries,
  showPages,
  onOpen,
  onGoTo,
}: EntryListProps) {
  const groups = groupEntries(entries)
  return (
    <div className="entry-groups">
      {groups.map((group) => (
        <section key={group.key} className="entry-group">
          <GroupTitle group={group} showPage={showPages} />
          <ul className="entry-list">
            {group.entries.map((entry) => (
              <li key={entry.id} className="entry-row">
                <div className="entry-info">
                  <span className="entry-name">
                    {kindLabel(entry) && (
                      <>
                        <span className="kind-label">
                          {kindLabel(entry)}
                        </span>{' '}
                      </>
                    )}
                    {entry.name}
                  </span>
                  <span className="entry-meta">{countsText(entry)}</span>
                  <span className="entry-health-row">
                    <HealthBar counts={entry.counts} size="small" />
                    <span className="entry-health">
                      {formatHealth(entry.health)}
                    </span>
                  </span>
                </div>
                <div className="entry-actions">
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Open ${entry.name}`}
                    onClick={() => onOpen(entry)}
                  >
                    Open
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Go to ${entry.name}`}
                    onClick={() => onGoTo(entry)}
                  >
                    Go to
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
