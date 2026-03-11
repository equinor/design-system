import type { AnchorHTMLAttributes } from 'react'

export type LinkVariant = 'inline' | 'standalone'

export type LinkProps = {
  /** Link destination URL */
  href: string
  /** Visual variant
   * - `inline` (default): used within text, inherits surrounding font size
   * - `standalone`: used on its own with flex layout, compose icons as children
   */
  variant?: LinkVariant
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
