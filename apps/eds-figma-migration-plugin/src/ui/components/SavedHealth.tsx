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
            {saved.frames.slice(0, 5).map((frame) => (
              <li key={`${frame.pageName}|${frame.name}`}>
                <span>
                  {frame.name}
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
