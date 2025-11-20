import type { HTMLAttributes, ReactNode } from 'react'

export type PlaceholderTone =
  | 'neutral'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type PlaceholderProps = {
  /** Visual tone that controls accent colors */
  tone?: PlaceholderTone
  /** Content displayed inside the placeholder */
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>
