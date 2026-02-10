import type { HTMLAttributes, ReactNode, ElementType } from 'react'

export type MenuProps = {
  /** Element the menu is anchored to for positioning */
  anchorEl?: HTMLElement | null
  /** Controls whether the menu is visible */
  open?: boolean
  /** Callback when the menu should close */
  onClose?: () => void
  /** Placement of the menu relative to the anchor element */
  placement?: 'top' | 'bottom' | 'left' | 'right'
} & HTMLAttributes<HTMLDivElement>

export type MenuItemProps = {
  /** Whether the item is visually highlighted as active */
  active?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether clicking this item should close the menu (default: true) */
  closeMenuOnClick?: boolean
  /** Render as a different element type (e.g., 'a' for links) */
  as?: ElementType
} & HTMLAttributes<HTMLButtonElement>

export type MenuSectionProps = {
  /** Optional section title */
  title?: string
  /** Menu items within this section */
  children: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>
