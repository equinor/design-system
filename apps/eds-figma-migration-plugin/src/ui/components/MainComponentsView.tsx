import { Button } from '@equinor/eds-core-react/next'
import type { EntrySummary, OldInstance } from '../../scan/types'
import { EntryList } from './EntryList'
import { MainComponentLabel } from './MainComponentLabel'

type MainComponentsViewProps = {
  /** The local main components in the scope */
  components: EntrySummary[]
  /** Instances in the scope that still use legacy variables */
  instances: OldInstance[]
  showPages: boolean
  onGoToPage: (pageId: string) => void
  onOpen: (entry: EntrySummary) => void
  onGoTo: (entry: EntrySummary) => void
  /** Selects layers in Figma, switching page when needed */
  onSelect: (nodeIds: string[]) => void
  /** Goes to a main component's page and scans it */
  onScanPageOf: (nodeId: string) => void
  /** Scans the file, so every main component on the scanned pages is in the scope */
  onScanFile: () => void
  /** Set when the page picker leaves pages out of a scan of the file */
  partialFile?: PartialFile
  busy: boolean
}

/** The pages a scan of the file reads, when the page picker leaves some out */
export type PartialFile = { chosen: number; total: number }

type Elsewhere = {
  id: string
  name: string
  instances: number
  legacy: number
}

/**
 * Local main components that instances in the scope use but that are not
 * in the scope, so a scan of this scope cannot change them.
 */
export function mainComponentsElsewhere(
  components: EntrySummary[],
  instances: OldInstance[],
): Elsewhere[] {
  const inScope = new Set(components.flatMap((entry) => entry.nodeIds))
  const found = new Map<string, Elsewhere>()
  for (const instance of instances) {
    const main = instance.mainComponent
    if (!main?.id || main.remote || inScope.has(main.id)) continue
    const item = found.get(main.id) ?? {
      id: main.id,
      name: main.name,
      instances: 0,
      legacy: 0,
    }
    item.instances += 1
    item.legacy += instance.count
    found.set(main.id, item)
  }
  return [...found.values()].sort((a, b) => b.legacy - a.legacy)
}

/**
 * The main components the migration depends on: those in the scope, which
 * Apply in the footer of this tab changes in one run, without the frames,
 * and those on other pages that instances in the scope use, with a way to
 * go to them, scan their page, or scan the file to bring them all in.
 */
export function MainComponentsView({
  components,
  instances,
  showPages,
  onGoToPage,
  onOpen,
  onGoTo,
  onSelect,
  onScanPageOf,
  onScanFile,
  partialFile,
  busy,
}: MainComponentsViewProps) {
  const elsewhere = mainComponentsElsewhere(components, instances)
  if (components.length === 0 && elsewhere.length === 0) {
    return (
      <p className="muted">
        No main component in this file is in the scope or used by its instances.
      </p>
    )
  }
  return (
    <div className="stack">
      <p className="muted">
        Changing a main component changes every instance of it in the file, and
        keeps the text and other overrides set in each instance.
      </p>
      {components.length > 0 && (
        <section className="stack-tight" aria-labelledby="main-in-scope">
          <h2 id="main-in-scope" className="section-title">
            In the scope
          </h2>
          <p className="muted">
            Apply in the footer changes all of these main components in one run,
            and nothing else. The frames in the scope stay as they are until you
            apply them from Changes or Frames.
          </p>
          <EntryList
            entries={components}
            showPages={showPages}
            onGoToPage={onGoToPage}
            onOpen={onOpen}
            onGoTo={onGoTo}
          />
        </section>
      )}
      {elsewhere.length > 0 && (
        <section className="stack-tight" aria-labelledby="main-elsewhere">
          <h2 id="main-elsewhere" className="section-title">
            Used here, on another page
          </h2>
          <p className="muted">
            {partialFile
              ? 'Instances in the scope use these, but their main components are outside it. Scan the pages chosen for File to have the main components on them on this tab, or scan the page of one.'
              : 'Instances in the scope use these, but their main components are outside it. Scan the whole file to have every main component on this tab and apply them all at once, or scan the page of one.'}
          </p>
          <div className="panel-actions">
            <span />
            <Button
              size="small"
              variant="secondary"
              disabled={busy}
              onClick={onScanFile}
            >
              {partialFile
                ? `Scan ${partialFile.chosen} of ${partialFile.total} pages`
                : 'Scan the whole file'}
            </Button>
          </div>
          <ul className="entry-list">
            {elsewhere.map((item) => (
              <li key={item.id} className="entry-row">
                <div className="entry-info">
                  <span className="entry-name">
                    <MainComponentLabel /> {item.name}
                  </span>
                  <span className="entry-meta">
                    {item.instances} instance{item.instances === 1 ? '' : 's'}{' '}
                    here, {item.legacy} legacy value
                    {item.legacy === 1 ? '' : 's'} inside{' '}
                    {item.instances === 1 ? 'it' : 'them'}
                  </span>
                </div>
                <div className="entry-actions">
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Go to the main component ${item.name}`}
                    onClick={() => onSelect([item.id])}
                  >
                    Go to
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    disabled={busy}
                    aria-label={`Go to the page of ${item.name} and scan it`}
                    onClick={() => onScanPageOf(item.id)}
                  >
                    Scan its page
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
