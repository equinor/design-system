import { useEffect, useMemo, useState } from 'react'
import { Button, Icon } from '@equinor/eds-core-react/next'
import { arrow_back } from '@equinor/eds-icons'
import { pickerOptions } from '../../mapping/picker'
import { propertyLabel } from '../../scan/labels'
import type { OverrideValue } from '../../scan/mapping'
import { pathBelow } from '../paths'
import type { ReviewItem } from '../review'
import { targetLabel } from '../targets'
import { VariableList } from './VariableList'

type Decision = 'confirmed' | 'changed' | 'left' | 'skipped'

type ReviewViewProps = {
  /** The items, fixed when the review starts, so a decision does not move the list */
  items: ReviewItem[]
  /** Entry id → name, to say which frame a binding is in */
  entryNames: Map<string, string>
  colorScheme: 'light' | 'dark'
  onSelect: (nodeIds: string[]) => void
  /** Stores a choice for one binding; null leaves it as it is */
  onDecide: (item: ReviewItem, value: OverrideValue) => void
  onDone: () => void
}

/**
 * Steps through the bindings that need a check, one at a time: selects the
 * layer in Figma, shows why the rule was unsure, the proposal and the other
 * candidates, and lets the designer confirm, choose another target, leave
 * the binding or skip it.
 */
export function ReviewView({
  items,
  entryNames,
  colorScheme,
  onSelect,
  onDecide,
  onDone,
}: ReviewViewProps) {
  const [index, setIndex] = useState(0)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const item = items[index] as ReviewItem | undefined
  const [value, setValue] = useState<string | null | undefined>(
    item?.row.proposal,
  )
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
            <strong>{count('left')}</strong> left as they are
          </li>
          <li>
            <strong>{count('skipped')}</strong> skipped, still need a check
          </li>
        </ul>
        <p className="muted">
          Confirmed and changed bindings now count as Ready. Apply them from the
          overview or the frame.
        </p>
        <div>
          <Button onClick={onDone}>Back</Button>
        </div>
      </section>
    )
  }

  const { group, row, binding } = item
  const isProposal = value === row.proposal
  const entryName = entryNames.get(binding.entryId)
  const path = pathBelow(binding.path, entryName)

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
          {binding.nodeName} · {propertyLabel(binding.property)}
        </h2>
        <span className="binding-path">
          {[entryName, path].filter(Boolean).join(' / ')}
        </span>
        <span className="binding-swap">
          <span className="binding-old">{group.old}</span>
          <span aria-hidden="true"> → </span>
          <span className="binding-new">{targetLabel(value ?? null)}</span>
        </span>
        {row.reason && (
          <p className="review-reason">
            <strong>Why it needs a check: </strong>
            {row.reason}
          </p>
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

      <VariableList
        options={options}
        value={value}
        onChange={setValue}
        colorScheme={colorScheme}
      />

      <div className="review-actions">
        <Button
          disabled={value === undefined}
          onClick={() => {
            if (value === undefined) return
            onDecide(item, value)
            next(value === null ? 'left' : isProposal ? 'confirmed' : 'changed')
          }}
        >
          {value === null
            ? 'Leave as it is'
            : isProposal
              ? 'Confirm proposal'
              : 'Use this target'}
        </Button>
        <Button variant="secondary" onClick={() => next('skipped')}>
          Skip
        </Button>
        <Button variant="ghost" disabled={index === 0} onClick={back}>
          Previous
        </Button>
      </div>
    </section>
  )
}
