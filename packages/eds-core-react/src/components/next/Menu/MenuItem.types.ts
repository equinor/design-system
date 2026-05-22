import type { LiHTMLAttributes } from 'react'

export type MenuItemProps = {
  /** Marks the item as keyboard-focused */
  active?: boolean
} & LiHTMLAttributes<HTMLLIElement>
