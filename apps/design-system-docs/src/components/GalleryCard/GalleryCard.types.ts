import type { CSSProperties, ReactNode } from 'react'

export type GalleryMockLayout =
  'row' | 'stack' | 'selection' | 'full' | 'icon' | 'links' | 'center'

export type GalleryCardProps = {
  /** Doc page the card links to (relative doc path). */
  href: string
  title: ReactNode
  subtitle?: ReactNode
  /** Layout wrapper for the live preview. Defaults to `row`. */
  mock?: GalleryMockLayout
  /** Extra styles on the mock wrapper (escape hatch for one-off previews). */
  mockStyle?: CSSProperties
  /** The live component preview. */
  children?: ReactNode
}

export type GalleryGridProps = {
  children?: ReactNode
}
