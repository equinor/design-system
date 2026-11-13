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

const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`

function summary(run: Run): string {
  if (run.kind === 'apply') {
    const { values, numbers, modes, layers, modesKept } = run.result
    // Test session finding 10: values, widths and modes are told apart.
    const done = [
      values > 0 && `migrated ${plural(values, 'value')}`,
      numbers > 0 && `set ${plural(numbers, 'border width')} as numbers`,
      modes > 0 && `removed or replaced ${plural(modes, 'legacy mode')}`,
    ].filter((part): part is string => Boolean(part))
    const what =
      done.length === 0
        ? 'Changed nothing'
        : done.length === 1
          ? done[0]
          : `${done.slice(0, -1).join(', ')} and ${done[done.length - 1]}`
    const parts = [
      `${what.charAt(0).toUpperCase()}${what.slice(1)}, on ${plural(layers, 'layer')}.`,
    ]
    if (modesKept > 0) {
      parts.push(
        `${plural(modesKept, 'legacy mode')} stay${modesKept === 1 ? 's' : ''} because layers below still use legacy variables.`,
      )
    }
    return parts.join(' ')
  }
  if (run.kind === 'convert') {
    const { converted, monoNumbers, instanceTexts, caseIds } = run.result
    const parts = [
      `Converted ${plural(converted, 'Typography component')} to text.`,
    ]
    if (instanceTexts > 0) {
      parts.push(
        `In main components, ${plural(instanceTexts, 'instance')} kept ${instanceTexts === 1 ? 'its' : 'their'} own text.`,
      )
    }
    if (caseIds.length > 0) {
      parts.push(
        `${caseIds.length} had another text case, such as uppercase, which the text style does not have; the style is kept, so the text shows as written.`,
      )
    }
    if (monoNumbers > 0) {
      parts.push(
        `${monoNumbers} used mono numbers, which a text style cannot carry and a plugin cannot set; set tabular figures on ${monoNumbers === 1 ? 'it' : 'them'} by hand where they matter.`,
      )
    }
    return parts.join(' ')
  }
  const { reverted, layers } = run.result
  return `Put back ${plural(reverted, 'change')} on ${plural(layers, 'layer')}.`
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
