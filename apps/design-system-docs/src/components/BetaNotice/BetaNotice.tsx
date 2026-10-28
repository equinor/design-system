/**
 * The Beta note, shown above the component docs.
 *
 * `DocItem/Layout` renders it for every component page that gets the hero band
 * from the layout, which puts it under the page title. The component landing
 * page builds its own title with `<Hero>` inside the MDX, where the layout
 * cannot reach, so that page places this component itself, inside a
 * `.container` so it lines up with the hero and the sections below. Keep the
 * two in step: the note belongs directly under the title, never above it.
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
      Beta is the 3.0.0 beta of <code>eds-core-react</code>, safe to adopt
      alongside the Latest components (2.x). The API may still change in small
      ways before 3.0.0 is released.
    </div>
  )
}

BetaNotice.displayName = 'BetaNotice'
