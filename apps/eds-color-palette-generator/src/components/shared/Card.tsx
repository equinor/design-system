import { useId } from 'react'
import type { ReactNode } from 'react'

export type CardProps = {
  /** Section heading, rendered as an `h2` in the EDS heading font */
  title?: ReactNode
  /** One line of supporting text under the title */
  description?: ReactNode
  /** Controls at the right of the header, e.g. buttons or a picker */
  actions?: ReactNode
  children?: ReactNode
  className?: string
  /** Padding around the content. Set `false` for full-bleed content. */
  padded?: boolean
  'data-testid'?: string
}

/**
 * The section container: background.surface, a muted border and the EDS
 * corner radius. With a title, the section is labelled by its heading.
 */
export function Card({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
  'data-testid': testId,
}: CardProps) {
  const headingId = useId()
  const hasHeader = Boolean(title || description || actions)

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      data-testid={testId}
      className={[
        'rounded border border-muted bg-surface text-primary',
        padded ? 'p-5' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasHeader && (
        <div
          className={[
            'mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2',
            padded ? '' : 'px-5 pt-5',
          ].join(' ')}
        >
          <div className="min-w-0">
            {title && (
              <h2
                id={headingId}
                className="m-0 text-header-md font-medium text-primary"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="m-0 mt-1 text-sm text-secondary">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
