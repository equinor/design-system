/**
 * The EDS 2.0 beta note, shown above the component docs.
 *
 * `DocItem/Layout` renders it for every component page that gets the hero band
 * from the layout, which puts it under the page title. The component landing
 * page builds its own title with `<Hero>` inside the MDX, where the layout
 * cannot reach, so that page places this component itself. Keep the two in
 * step: the note belongs directly under the title, never above it.
 *
 * `className` replaces the default spacing rather than adding to it, so a page
 * that places the note itself can match its own rhythm: the landing page needs
 * space above, where the layout's chrome normally supplies it, and none below,
 * where the first `.docs-section` already brings its own padding.
 */
export function BetaNotice({
  className = 'margin-bottom--md',
}: {
  /** Spacing utilities for this placement. Replaces the default. */
  className?: string
}) {
  return (
    <div className={`alert alert--info ${className}`} role="note">
      EDS 2.0 is in beta: safe to adopt alongside EDS 1. The API may still
      change in small ways before it ships as <code>eds-core-react</code> 3.0.0.
    </div>
  )
}

BetaNotice.displayName = 'BetaNotice'
