import { Fragment, useState } from 'react'
import { Accordion, Button } from '@equinor/eds-core-react/next'
import { formatHealth, healthOf, oldCount, sumCounts } from '../../scan/summary'
import type { EntryKind, EntrySummary } from '../../scan/types'
import { HealthBar } from './HealthBar'

type EntryListProps = {
  entries: EntrySummary[]
  /** Show the page in group headings, for a scan of the whole file */
  showPages: boolean
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
  /** Switches Figma to a page, in a scan of the whole file */
  onGoToPage?: (pageId: string) => void
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
  if (entry.instanceCount !== undefined) {
    parts.push(
      `used ${entry.instanceCount} time${entry.instanceCount === 1 ? '' : 's'} in the file`,
    )
  }
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

/** “12 frames”, or “12 frames and layers” when some are loose layers. */
function entryNoun(entries: EntrySummary[]): string {
  const frames = entries.filter((entry) => entry.kind === 'frame').length
  if (frames === entries.length) return frames === 1 ? 'frame' : 'frames'
  if (frames === 0) return entries.length === 1 ? 'layer' : 'layers'
  return 'frames and layers'
}

function frameCount(entries: EntrySummary[]): string {
  const frames = entries.filter((entry) => entry.kind === 'frame').length
  return `${frames} frame${frames === 1 ? '' : 's'}`
}

function Groups({
  entries,
  showPage,
  onOpen,
  onGoTo,
}: {
  entries: EntrySummary[]
  showPage: boolean
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
}) {
  // Frames and layers without EDS variables have nothing to migrate; they
  // are hidden unless asked for, so the list shows the work.
  const [showEmpty, setShowEmpty] = useState(false)
  const empty = entries.filter((entry) => entry.health === null)
  const visible = showEmpty
    ? entries
    : entries.filter((entry) => entry.health !== null)
  return (
    <div className="entry-groups">
      {groupEntries(visible).map((group) => (
        <section key={group.key} className="entry-group">
          {(showPage || group.sections.length > 0) && (
            <GroupTitle group={group} showPage={showPage} />
          )}
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
                  {entry.health === null ? (
                    <span className="entry-meta">No EDS variables</span>
                  ) : (
                    <>
                      <span className="entry-meta">{countsText(entry)}</span>
                      <span className="entry-health-row">
                        <HealthBar counts={entry.counts} size="small" />
                        <span className="entry-health">
                          {formatHealth(entry.health)}
                        </span>
                      </span>
                    </>
                  )}
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
      {empty.length > 0 && (
        <div className="empty-entries">
          {visible.length === 0 && (
            <p className="muted">Nothing here uses EDS variables.</p>
          )}
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowEmpty((previous) => !previous)}
          >
            {showEmpty
              ? `Hide ${empty.length} ${entryNoun(empty)} without EDS variables`
              : `Show ${empty.length} ${entryNoun(empty)} without EDS variables`}
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * The entries in the scan, grouped by page and section. A scan of the whole
 * file shows one page at a time, each in its own accordion item with its own
 * health bar. The Beta has no list or table component, so the rows are built
 * here (BETA-GAPS.md).
 */
export function EntryList({
  entries,
  showPages,
  onOpen,
  onGoTo,
  onGoToPage,
}: EntryListProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  if (!showPages) {
    return (
      <Groups
        entries={entries}
        showPage={false}
        onOpen={onOpen}
        onGoTo={onGoTo}
      />
    )
  }
  const pages = new Map<string, { name: string; entries: EntrySummary[] }>()
  for (const entry of entries) {
    const page = pages.get(entry.pageId) ?? {
      name: entry.pageName,
      entries: [],
    }
    page.entries.push(entry)
    pages.set(entry.pageId, page)
  }
  return (
    <Accordion className="binding-groups">
      {[...pages.entries()].map(([pageId, page]) => {
        const counts = sumCounts(page.entries.map((entry) => entry.counts))
        const health = healthOf(counts)
        const isOpen = open.has(pageId)
        return (
          <Accordion.Item
            key={pageId}
            open={isOpen}
            onOpenChange={(next) =>
              setOpen((previous) => {
                const copy = new Set(previous)
                if (next) copy.add(pageId)
                else copy.delete(pageId)
                return copy
              })
            }
          >
            <Accordion.Header>
              <span className="group-header">
                <span className="binding-name">
                  <span className="kind-label">Page</span> {page.name}
                </span>
                {health === null ? (
                  <span className="binding-path">
                    No EDS variables · {frameCount(page.entries)}
                  </span>
                ) : (
                  <span className="entry-health-row">
                    <HealthBar counts={counts} size="small" />
                    <span className="entry-health">{formatHealth(health)}</span>
                    <span className="binding-path">
                      {frameCount(page.entries)} · {oldCount(counts)} legacy
                    </span>
                  </span>
                )}
              </span>
            </Accordion.Header>
            <Accordion.Panel>
              {isOpen && onGoToPage && (
                <div className="panel-actions">
                  <span />
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Go to the page ${page.name}`}
                    onClick={() => onGoToPage(pageId)}
                  >
                    Go to page
                  </Button>
                </div>
              )}
              {isOpen && (
                <Groups
                  entries={page.entries}
                  showPage={false}
                  onOpen={onOpen}
                  onGoTo={onGoTo}
                />
              )}
            </Accordion.Panel>
          </Accordion.Item>
        )
      })}
    </Accordion>
  )
}
