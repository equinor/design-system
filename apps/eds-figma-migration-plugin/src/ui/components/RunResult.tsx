import { Banner, Button } from '@equinor/eds-core-react/next'
import type { ApplyResult, RevertResult } from '../../shared/messages'

export type Run =
  | { kind: 'apply'; result: ApplyResult }
  | { kind: 'revert'; result: RevertResult }

type RunResultProps = {
  run: Run
  onDismiss: () => void
  onSelect: (nodeIds: string[]) => void
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
  const { reverted, layers } = run.result
  return `Put back ${reverted} change${reverted === 1 ? '' : 's'} on ${layers} layer${layers === 1 ? '' : 's'}.`
}

/** What an apply or a revert did, and what it could not do, with Go to for each failure. */
export function RunResult({ run, onDismiss, onSelect }: RunResultProps) {
  const { failed } = run.result
  return (
    <Banner
      tone={failed.length > 0 ? 'warning' : 'success'}
      onDismiss={onDismiss}
    >
      <Banner.Message>
        {summary(run)}
        {failed.length > 0 &&
          ` ${failed.length} could not be ${run.kind === 'apply' ? 'made' : 'put back'}:`}
      </Banner.Message>
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
