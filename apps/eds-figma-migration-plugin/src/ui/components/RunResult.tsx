import { Banner, Button } from '@equinor/eds-core-react/next'
import type {
  ApplyResult,
  ConvertResult,
  RevertResult,
} from '../../shared/messages'

export type Run =
  | { kind: 'apply'; result: ApplyResult }
  | { kind: 'revert'; result: RevertResult }
  | { kind: 'convert'; result: ConvertResult }

type RunResultProps = {
  run: Run
  onDismiss: () => void
  onSelect: (nodeIds: string[]) => void
  /** UX review F11: the way back, right after an apply in one frame */
  onRevert?: () => void
}

function summary(run: Run): string {
  if (run.kind === 'apply') {
    const { applied, layers, modesKept } = run.result
    const parts = [
      `Applied ${applied} change${applied === 1 ? '' : 's'} on ${layers} layer${layers === 1 ? '' : 's'}.`,
    ]
    if (modesKept > 0) {
      parts.push(
        `${modesKept} legacy mode${modesKept === 1 ? '' : 's'} stay${modesKept === 1 ? 's' : ''} because layers below still use legacy variables.`,
      )
    }
    return parts.join(' ')
  }
  if (run.kind === 'convert') {
    const { converted, monoNumbers } = run.result
    const parts = [
      `Converted ${converted} Typography component${converted === 1 ? '' : 's'} to text.`,
    ]
    if (monoNumbers > 0) {
      parts.push(
        `${monoNumbers} used mono numbers, which a text style cannot carry; set tabular figures by hand where they matter.`,
      )
    }
    return parts.join(' ')
  }
  const { reverted, layers } = run.result
  return `Put back ${reverted} change${reverted === 1 ? '' : 's'} on ${layers} layer${layers === 1 ? '' : 's'}.`
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
        {summary(run)}
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
      {failed.length > 0 && (
        <Banner.Actions placement="bottom">
          <ul className="run-failures">
            {failed.slice(0, 8).map((failure) => (
              <li key={`${failure.nodeId}|${failure.property}`}>
                <span>
                  <strong>{failure.nodeName}</strong> · {failure.property}:{' '}
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
