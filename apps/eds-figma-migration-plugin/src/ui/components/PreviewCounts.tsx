/**
 * The body of an Apply or Convert confirmation: the text built from the
 * plugin's preview of the run (ui/preview.ts, applyText and convertText),
 * so the dialog says what the run changes, what changes inside instances,
 * the legacy modes that stay or go, the instances Convert leaves, and the
 * change log the run writes. Until the plugin answers, it says it is
 * counting.
 */
import { Fragment } from 'react'
import type { ConfirmationText } from '../preview'

/**
 * Keys for lines that can repeat, such as two layers with the same name
 * and the same legacy mode: the line, and how often it came before.
 */
function keyed(lines: string[]): [string, string][] {
  const seen = new Map<string, number>()
  return lines.map((line) => {
    const n = seen.get(line) ?? 0
    seen.set(line, n + 1)
    return [`${line}#${n}`, line]
  })
}

export function PreviewCounts({
  text,
  counting,
}: {
  text?: ConfirmationText
  /** What the dialog says while the plugin counts */
  counting: string
}) {
  if (!text) {
    return (
      <p className="muted" role="status">
        {counting}
      </p>
    )
  }
  const { lead, changes, details, lists, notes, footnote } = text
  return (
    <div className="stack-tight">
      {lead && <p>{lead}</p>}
      {typeof changes === 'string' ? (
        <p>{changes}</p>
      ) : (
        <>
          <p>{changes.lead}</p>
          <ul className="review-summary">
            {keyed(changes.items).map(([key, line]) => (
              <li key={key}>{line}</li>
            ))}
          </ul>
        </>
      )}
      {keyed(details).map(([key, line]) => (
        <p key={key}>{line}</p>
      ))}
      {lists.map((list) => (
        <Fragment key={list.lead}>
          <p>{list.lead}</p>
          <ul className="review-summary">
            {keyed(list.items).map(([key, item]) => (
              <li key={key}>{item}</li>
            ))}
          </ul>
        </Fragment>
      ))}
      {keyed(notes).map(([key, line]) => (
        <p key={key}>{line}</p>
      ))}
      <p className="muted">{footnote}</p>
    </div>
  )
}
