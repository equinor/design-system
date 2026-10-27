import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarEmphasis, AvatarSize } from './Avatar.types'

export type AvatarNameLabelLayout = 'horizontal' | 'vertical'

export type AvatarNameLabelProps = {
  /** Name of the person, displayed as the primary label. Also auto-derives the avatar initial. */
  name: string
  /** Secondary label, such as an email, a job title or any short metadata */
  meta?: string
  /**
   * Layout variant for the name/email block.
   *
   * - `'horizontal'`: name and email are **stacked** (column). Use in vertical
   *   lists where each row shows one person.
   * - `'vertical'`: name and email are **inline** (row). Use in horizontal
   *   lists or compact contexts where a single line per person is needed.
   *
   * Note: the naming follows the Figma component naming convention and refers
   * to the orientation of the containing list, not the internal text direction.
   * @default 'horizontal'
   */
  layout?: AvatarNameLabelLayout
  /** Override the initial shown in the avatar (defaults to first letter of name) */
  initial?: string
  /** Profile photo URL. When provided, renders a circular photo instead of initials. */
  src?: string
  /** Alt text for the photo. Defaults to `""` (decorative) so the visible name is not announced twice. Pass a value to override. */
  alt?: string
  /**
   * Size of the avatar
   * @default 'lg'
   */
  size?: AvatarSize
  /**
   * Colour emphasis of the avatar
   * @default 'low'
   */
  emphasis?: AvatarEmphasis
  /**
   * Show a red notification dot on the avatar
   * @default false
   */
  notification?: boolean
  /** Optional slot for content to the right (e.g. an icon or action button) */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
