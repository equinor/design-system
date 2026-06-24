import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarEmphasis, AvatarSize } from './Avatar.types'

export type AvatarNameLabelLayout = 'horizontal' | 'vertical'

export type AvatarNameLabelProps = {
  /** Full name displayed as the primary label */
  fullName: string
  /** Secondary label — email, job title, or any short metadata string */
  meta?: string
  /**
   * Layout variant for the name/email block.
   *
   * - `'horizontal'` — name and email are **stacked** (column). Use in vertical
   *   lists where each row shows one person.
   * - `'vertical'` — name and email are **inline** (row). Use in horizontal
   *   lists or compact contexts where a single line per person is needed.
   *
   * Note: the naming follows the Figma component naming convention and refers
   * to the orientation of the containing list, not the internal text direction.
   */
  layout?: AvatarNameLabelLayout
  /** Override the initial shown in the avatar (defaults to first letter of fullName) */
  initial?: string
  /** Size of the avatar */
  size?: AvatarSize
  /** Colour emphasis of the avatar */
  emphasis?: AvatarEmphasis
  /** Show a notification dot on the avatar */
  notification?: boolean
  /** Optional slot for content to the right (e.g. an icon or action button) */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
