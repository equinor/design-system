import { useEffect, useMemo, useState } from 'react'
import { Button, Icon } from '@equinor/eds-core-react/next'
import { arrow_back } from '@equinor/eds-icons'
import { pickerOptions } from '../../mapping/picker'
import { propertyLabel } from '../labels'
import { DECIDE_LATER } from '../../scan/mapping'
import type { OverrideValue } from '../../scan/mapping'
import { pathBelow } from '../paths'
import { plainReason, targetMeaning } from '../plain'
import type { ReviewItem } from '../review'
import { DECIDE_LATER_LABEL, targetLabel } from '../targets'
import { VariableList } from './VariableList'

type Decision = 'confirmed' | 'changed' | 'later' | 'skipped'

type ReviewViewProps = {
  /** The items, fixed when the review starts, so a decision does not move the list */
  items: ReviewItem[]
  /** Entry id → name, to say which frame a binding is in */
  entryNames: Map<string, string>
  onSelect: (nodeIds: string[]) => void
  /** Stores a choice for one binding: a target, or DECIDE_LATER */
  onDecide: (item: ReviewItem, value: OverrideValue) => void
  /**
   * What makes the decided values: Apply for Changes, Convert for the text
   * styles and colours on the Typography tab
   */
  run?: 'Apply' | 'Convert'
  onDone: () => void
}

/**
 * Steps through the bindings that need a check or have a stand-in, one at a
 * time: selects the layer in Figma, shows why the rule was unsure or what
 * the EDS Beta lacks, the proposal and the other candidates, and lets the
 * designer confirm, choose another target, decide later, or skip it for
 * now. Decide later is stored, so the value says so in Changes; both come
 * back in the next review.
 */
export function ReviewView({
  items,
  entryNames,
  onSelect,
  onDecide,
  run = 'Apply',
  onDone,
}: ReviewViewProps) {
  const [index, setIndex] = useState(0)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const item = items[index] as ReviewItem | undefined
  const [value, setValue] = useState<string | undefined>(item?.row.proposal)
  const options = useMemo(
    () =>
      item
        ? pickerOptions({
            kinds: item.binding.kind ? [item.binding.kind] : [],
            group: item.group.group,
            candidates: item.row.candidates,
          })
        : { proposed: [], others: [] },
    [item],
  )

  // Show the layer on the canvas at every step.
  const nodeId = item?.binding.nodeId
  useEffect(() => {
    if (nodeId) onSelect([nodeId])
    // onSelect is stable enough; selecting again on every render would fight the designer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId])

  const next = (decision: Decision) => {
    const updated = [...decisions]
    updated[index] = decision
    setDecisions(updated)
    const following = items[index + 1]
    setIndex(index + 1)
    setValue(following?.row.proposal)
  }
  const back = () => {
    if (index === 0) return
    const previous = items[index - 1]
    setIndex(index - 1)
    setValue(previous.row.proposal)
  }

  if (!item) {
    const count = (decision: Decision) =>
      decisions.filter((candidate) => candidate === decision).length
    return (
      <section className="stack" aria-labelledby="review-done">
        <h2 id="review-done" className="inspector-title">
          Review done
        </h2>
        <ul className="review-summary">
          <li>
            <strong>{count('confirmed')}</strong> proposals confirmed
          </li>
          <li>
            <strong>{count('changed')}</strong> given another target
          </li>
          <li>
            <strong>{count('later')}</strong> set to Decide later, left for a
            later run
          </li>
          <li>
            <strong>{count('skipped')}</strong> skipped, still to decide on
          </li>
        </ul>
        <p className="muted">
          {run === 'Convert'
            ? 'Confirmed and changed text styles and colours now count as Ready. Convert the instances on the Typography tab.'
            : 'Confirmed and changed bindings, and accepted fixes, now count as Ready. Apply them from the overview or the frame.'}
        </p>
        <div>
          <Button onClick={onDone}>Back</Button>
        </div>
      </section>
    )
  }

  const { group, row, binding } = item
  const isManualFix = row.outcome === 'byHand'
  // No equivalent: the proposal is a stand-in for a token the EDS Beta lacks.
  const isStandIn = row.outcome === 'none'
  const isProposal = value === row.proposal
  const entryName = entryNames.get(binding.entryId)
  const path = pathBelow(binding.path, entryName)
  // Many layers share a name, such as Label or Cell, so the title says where
  // the layer is (UX review F10).
  const parent = binding.path[binding.path.length - 1]
  // A value with a reason of its own, such as a text case a conversion
  // drops, shows that one instead of the row's.
  const reason = binding.reason ?? row.reason
  const plain = plainReason(reason)

  return (
    <section className="stack review" aria-labelledby="review-title">
      <div className="inspector-header">
        <Button variant="ghost" size="small" onClick={onDone}>
          <Icon data={arrow_back} size="md" />
          Stop review
        </Button>
        <span className="muted" aria-live="polite">
          {index + 1} of {items.length}
        </span>
      </div>
      <div
        className="review-progress"
        role="progressbar"
        aria-label="Review progress"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={index}
      >
        <span style={{ inlineSize: `${(index / items.length) * 100}%` }} />
      </div>

      <div className="stack-tight">
        <h2 id="review-title" className="inspector-title">
          {binding.nodeName}
          {parent && parent !== binding.nodeName ? ` in ${parent}` : ''}
        </h2>
        <span className="binding-path">
          {propertyLabel(binding.property)},{' '}
          {[entryName, path].filter(Boolean).join(' / ')}
        </span>
        <span className="binding-swap">
          <span className="binding-old">{group.old}</span>
          <span aria-hidden="true"> → </span>
          <span className="binding-new">
            {targetLabel(
              isManualFix ? (row.proposal ?? null) : (value ?? null),
            )}
          </span>
        </span>
        {isManualFix && (
          <div className="review-reason">
            <strong>Why it needs a manual fix: </strong>
            {binding.reason ?? row.reason}
            <p>
              <strong>What the plugin does if you accept: </strong>
              it reads every change on the layer, resets the layer, swaps it
              back if it was swapped, and sets the changes again. It checks each
              change afterwards. If a change cannot be copied, the plugin leaves
              this layer as it is and says why.
            </p>
          </div>
        )}
        {!isManualFix && reason && (
          <div className="review-reason">
            <strong>
              {isStandIn
                ? 'No equivalent in the EDS Beta: '
                : row.outcome === 'sure'
                  ? 'Ready before you chose Decide later: '
                  : 'Why it needs a check: '}
            </strong>
            {plain ?? reason}
            {plain && (
              <details className="review-details">
                <summary>Details</summary>
                {reason}
              </details>
            )}
          </div>
        )}
        <div>
          <Button
            size="small"
            variant="secondary"
            onClick={() => onSelect([binding.nodeId])}
          >
            Go to layer
          </Button>
        </div>
      </div>

      {isManualFix ? (
        <div className="review-actions">
          <Button
            disabled={row.proposal === undefined}
            onClick={() => {
              if (row.proposal === undefined) return
              onDecide(item, row.proposal)
              next('confirmed')
            }}
          >
            Accept the fix
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onDecide(item, DECIDE_LATER)
              next('later')
            }}
          >
            {DECIDE_LATER_LABEL}
          </Button>
          <Button variant="secondary" onClick={() => next('skipped')}>
            Skip
          </Button>
          <Button variant="ghost" disabled={index === 0} onClick={back}>
            Previous
          </Button>
        </div>
      ) : (
        <>
          <VariableList
            options={options}
            value={value}
            onChange={setValue}
            schemes={[binding.scheme ?? 'light']}
            describe={targetMeaning}
          />
          <div className="review-actions">
            <Button
              disabled={value === undefined}
              onClick={() => {
                if (value === undefined) return
                onDecide(item, value)
                next(
                  value === DECIDE_LATER
                    ? 'later'
                    : isProposal
                      ? 'confirmed'
                      : 'changed',
                )
              }}
            >
              {value === DECIDE_LATER
                ? DECIDE_LATER_LABEL
                : isProposal
                  ? isStandIn
                    ? 'Use the stand-in'
                    : 'Confirm proposal'
                  : 'Use this target'}
            </Button>
            <Button variant="secondary" onClick={() => next('skipped')}>
              Skip
            </Button>
            <Button variant="ghost" disabled={index === 0} onClick={back}>
              Previous
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
