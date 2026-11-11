import { Badge, Button, Checkbox } from '@equinor/eds-core-react/next'
import { CATEGORY_LABELS } from '../labels'
import type { Category } from '../../scan/types'
import { BADGES } from '../badges'

type BindingRowProps = {
  /** The main line: a property in the Layers view, a layer in the Variables view */
  title: string
  /** A second line, such as the layer's path */
  subtitle?: string
  old?: string
  target: string
  /** Says when the target is a change someone made */
  note?: string
  reason?: string
  category: Category
  /** Shows a checkbox and a Change button */
  changeable: boolean
  selected: boolean
  onToggle: (selected: boolean) => void
  onSelectLayer: () => void
  onChange: () => void
}

/** One binding: what it is on, what it changes from and to, its status, and the actions on it. */
export function BindingRow({
  title,
  subtitle,
  old,
  target,
  note,
  reason,
  category,
  changeable,
  selected,
  onToggle,
  onSelectLayer,
  onChange,
}: BindingRowProps) {
  const badge = BADGES[category]
  return (
    <li className="binding-row">
      {changeable ? (
        <Checkbox
          className="binding-check"
          aria-label={`Select ${title}`}
          checked={selected}
          onChange={(event) => onToggle(event.target.checked)}
        />
      ) : (
        <span className="binding-check" aria-hidden="true" />
      )}
      <button type="button" className="binding-select" onClick={onSelectLayer}>
        <span className="binding-name">{title}</span>
        {subtitle && <span className="binding-path">{subtitle}</span>}
        <span className="binding-swap">
          {old && <span className="binding-old">{old}</span>}
          {old && <span aria-hidden="true"> → </span>}
          <span className="binding-new">{target}</span>
        </span>
        {note && <span className="override-note">{note}</span>}
        {reason && category !== 'sure' && (
          <span className="binding-reason">{reason}</span>
        )}
      </button>
      <div className="binding-actions">
        <Badge tone={badge.tone} emphasis={badge.emphasis}>
          {category === 'check' ? '⚠ ' : ''}
          {CATEGORY_LABELS[category]}
        </Badge>
        {changeable && (
          <Button
            size="small"
            variant="secondary"
            aria-label={`Change the target of ${title}`}
            onClick={onChange}
          >
            Change
          </Button>
        )}
      </div>
    </li>
  )
}
