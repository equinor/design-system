import { Banner, Button } from '@equinor/eds-core-react/next'
import { runSummary } from '../preview'
import type { Run } from '../preview'

export type { Run } from '../preview'

type RunResultProps = {
  run: Run
  onDismiss: () => void
  onSelect: (nodeIds: string[]) => void
  /** UX review F11: the way back, right after an apply in one frame */
  onRevert?: () => void
}

/** What an apply or a revert did, and what it could not do, with Go to for each failure. */
export function RunResult({
  run,
  onDismiss,
  onSelect,
  onRevert,
}: RunResultProps) {
  const { failed } = run.result
  return (
    <Banner
      tone={failed.length > 0 ? 'warning' : 'success'}
      onDismiss={onDismiss}
    >
      <Banner.Message>
        {runSummary(run)}
        {failed.length > 0 &&
          ` ${failed.length} could not be ${run.kind === 'revert' ? 'put back' : run.kind === 'convert' ? 'converted' : 'made'}:`}
        {run.kind === 'apply' &&
          !onRevert &&
          ' Each frame can be reverted from the frame.'}
      </Banner.Message>
      {onRevert && failed.length === 0 && (
        <Banner.Actions>
          <Button size="small" variant="secondary" onClick={onRevert}>
            Revert
          </Button>
        </Banner.Actions>
      )}
      {run.kind === 'convert' && run.result.monoNumberIds.length > 0 && (
        <Banner.Actions>
          <Button
            size="small"
            variant="secondary"
            onClick={() => onSelect(run.result.monoNumberIds)}
          >
            Select the mono number texts
          </Button>
        </Banner.Actions>
      )}
      {run.kind === 'convert' && run.result.skipped.length > 0 && (
        <Banner.Actions placement="bottom">
          <ul className="run-failures">
            {run.result.skipped.slice(0, 8).map((skip) => (
              <li key={skip.nodeId}>
                <span>
                  <strong>{skip.nodeName}</strong>: {skip.reason}
                </span>
                <Button
                  size="small"
                  variant="ghost"
                  aria-label={`Go to ${skip.nodeName}`}
                  onClick={() => onSelect([skip.nodeId])}
                >
                  Go to
                </Button>
              </li>
            ))}
            {run.result.skipped.length > 8 && (
              <li>and {run.result.skipped.length - 8} more</li>
            )}
          </ul>
        </Banner.Actions>
      )}
      {failed.length > 0 && (
        <Banner.Actions placement="bottom">
          <ul className="run-failures">
            {failed.slice(0, 8).map((failure) => (
              <li key={`${failure.nodeId}|${failure.property}`}>
                <span>
                  <strong>{failure.nodeName}</strong>, {failure.property}:{' '}
                  {failure.message}
                </span>
                <Button
                  size="small"
                  variant="ghost"
                  aria-label={`Go to ${failure.nodeName}`}
                  onClick={() => onSelect([failure.nodeId])}
                >
                  Go to
                </Button>
              </li>
            ))}
            {failed.length > 8 && <li>and {failed.length - 8} more</li>}
          </ul>
        </Banner.Actions>
      )}
    </Banner>
  )
}
