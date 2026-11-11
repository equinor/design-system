import { formatHealth } from '../../scan/summary'
import type { SavedHealth as Saved } from '../../shared/messages'
import { HealthBar, HealthLegend } from './HealthBar'

function when(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

function lowest(frames: Saved['frames']) {
  const merged = new Map<string, Saved['frames'][number] & { count: number }>()
  for (const frame of frames) {
    const key = `${frame.pageName}|${frame.name}`
    const found = merged.get(key)
    if (found) found.count += 1
    else merged.set(key, { ...frame, count: 1 })
  }
  return [...merged.values()].slice(0, 5)
}

/** The latest scan saved in the file, shown before the designer scans again. */
export function SavedHealth({ saved }: { saved: Saved }) {
  return (
    <section className="stack-tight saved-health" aria-labelledby="saved-title">
      <div className="health-heading">
        <h2 id="saved-title" className="section-title">
          Last scan
        </h2>
        <span className="health-value">{formatHealth(saved.health)}</span>
      </div>
      <p className="muted">
        {saved.place}, {when(saved.scannedAt)}, {saved.nodesScanned} layers.
        Scan again to see the current state and make changes.
      </p>
      <HealthBar counts={saved.totals} />
      <HealthLegend counts={saved.totals} />
      {saved.frames.length > 0 && (
        <>
          <h3 className="group-title">Lowest health</h3>
          <ul className="saved-frames">
            {/* UX review F12: one line per name and page. */}
            {lowest(saved.frames).map((frame) => (
              <li key={`${frame.pageName}|${frame.name}`}>
                <span>
                  {frame.name}
                  {frame.count > 1 ? ` ×${frame.count}` : ''}
                  <span className="binding-path"> · {frame.pageName}</span>
                </span>
                <span className="entry-health">
                  {formatHealth(frame.health)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
