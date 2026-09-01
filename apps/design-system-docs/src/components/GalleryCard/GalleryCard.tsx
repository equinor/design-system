import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'

import { isExternal } from '@site/src/utils/isExternal'
import type { GalleryCardProps, GalleryGridProps } from './GalleryCard.types'

import './component-gallery.css'

/**
 * Resolves a doc-relative `href` against the current page, treating that page
 * as a directory. Without this, `/docs/Next/components` (no trailing slash)
 * resolves `data-display/icon` to `/docs/Next/data-display/icon` — a 404.
 */
function useDocRelativeHref(href: string): string {
  const { pathname } = useLocation()

  if (isExternal(href) || href.startsWith('/') || href.startsWith('#')) {
    return href
  }

  const base = pathname.endsWith('/') ? pathname : `${pathname}/`
  return `${base}${href}`
}

/** Grid wrapper for GalleryCard items on the /components landing page. */
export function GalleryGrid({ children }: GalleryGridProps) {
  return <div className="component-gallery">{children}</div>
}

GalleryGrid.displayName = 'GalleryGrid'

/**
 * Live-preview card for the /components landing page: renders a real EDS
 * component in the preview area above a title + subtitle. A distinct card type
 * from the shared IconCard used elsewhere.
 */
export function GalleryCard({
  href,
  title,
  subtitle,
  mock = 'row',
  mockStyle,
  children,
}: GalleryCardProps) {
  const mockClasses = `mock mock--${mock}`
  const resolvedHref = useDocRelativeHref(href)

  return (
    <Link className="component-gallery__card" to={resolvedHref}>
      {/* Previews are decorative: inert removes them from tab order, pointer
          interaction, and the accessibility tree, so clicks land on the card link */}
      <div className="component-gallery__preview" inert>
        <div className={mockClasses} style={mockStyle}>
          {children}
        </div>
      </div>
      <div className="component-gallery__body">
        <div className="component-gallery__title">{title}</div>
        {subtitle && (
          <div className="component-gallery__subtitle">{subtitle}</div>
        )}
      </div>
    </Link>
  )
}

GalleryCard.displayName = 'GalleryCard'
