/**
 * What a run will change, from the plugin's preview, for the Apply
 * confirmations: the values, numbers, text styles and modes it changes,
 * the Manual fix resets, the changes inside instances, and the legacy modes
 * that stay with what each waits for.
 */
import type { RunPreview } from '../../scan/apply-plan'
import { instancesLine, keptLine, previewLines, removedLine } from '../preview'

/** How many kept legacy modes are named before "and N more" */
const KEPT_SHOWN = 5

export function PreviewCounts({ preview }: { preview?: RunPreview }) {
  if (!preview) {
    return (
      <p className="muted" role="status">
        Counting what the run changes…
      </p>
    )
  }
  const lines = previewLines(preview)
  const instances = instancesLine(preview)
  const kept = preview.modesKept
  const removed = preview.modesRemovedAnyway
  return (
    <div className="stack-tight">
      {lines.length > 0 ? (
        <>
          <p>This run makes these changes:</p>
          <ul className="review-summary">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>This run changes nothing.</p>
      )}
      {instances && <p>{instances}</p>}
      {removed.length > 0 && (
        <>
          <p>
            {removed.length === 1
              ? 'You chose to remove 1 legacy mode anyway:'
              : `You chose to remove ${removed.length} legacy modes anyway:`}
          </p>
          <ul className="review-summary">
            {removed.slice(0, KEPT_SHOWN).map((item) => (
              <li key={item.id}>{removedLine(item)}</li>
            ))}
            {removed.length > KEPT_SHOWN && (
              <li>and {removed.length - KEPT_SHOWN} more</li>
            )}
          </ul>
        </>
      )}
      {kept.length > 0 && (
        <>
          <p>
            {kept.length === 1
              ? '1 legacy mode stays, because values below it that read it are not changed in this run:'
              : `${kept.length} legacy modes stay, because values below them that read them are not changed in this run:`}
          </p>
          <ul className="review-summary">
            {kept.slice(0, KEPT_SHOWN).map((item) => (
              <li key={item.id}>{keptLine(item)}</li>
            ))}
            {kept.length > KEPT_SHOWN && (
              <li>and {kept.length - KEPT_SHOWN} more</li>
            )}
          </ul>
        </>
      )}
    </div>
  )
}
