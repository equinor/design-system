import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarEmphasis, AvatarSize } from './Avatar.types'

export type AvatarNameLabelLayout = 'horizontal' | 'vertical'

export type AvatarNameLabelProps = {
  /** Name of the person, displayed as the primary label. Also auto-derives the avatar initial. */
  name: string
  /** Secondary label, such as an email, a job title or any short metadata */
  meta?: string
  /**
   * `horizontal` stacks the name and meta, for lists with one person per row.
   * `vertical` puts them on one line, for headers and other wide contexts. The
   * names follow Figma and refer to the list the component sits in.
   * @default 'horizontal'
   */
  layout?: AvatarNameLabelLayout
  /** Override the initials shown in the avatar, which are otherwise derived from the first and last word of `name` */
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
