import type { AnchorHTMLAttributes, ReactNode } from 'react'

export type LinkVariant = 'inline' | 'standalone'

export type LinkProps = {
  /** Visual variant
   * - `inline` (default): used within text, inherits surrounding font size
   * - `standalone`: used on its own, supports icons
   */
  variant?: LinkVariant
  /** Icon displayed before the link text (standalone variant) */
  startIcon?: ReactNode
  /** Icon displayed after the link text (standalone variant) */
  endIcon?: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>
