import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarEmphasis, AvatarSize } from './Avatar.types'

export type AvatarNameLabelLayout = 'horizontal' | 'vertical'

export type AvatarNameLabelProps = {
  /** Name of the person, shown as the primary label. The avatar's initials are derived from it. */
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
  /** Initials for the avatar, instead of the ones derived from `name`. Passed to `Avatar`. */
  initial?: string
  /** Profile photo URL. Passed to `Avatar`. */
  src?: string
  /** Alt text for the photo. Defaults to `""` (decorative) so the visible name is not announced twice. Pass a value to override. */
  alt?: string
  /**
   * Size of the avatar. Passed to `Avatar`.
   * @default 'lg'
   */
  size?: AvatarSize
  /**
   * Colour emphasis of the avatar. Passed to `Avatar`.
   * @default 'low'
   */
  emphasis?: AvatarEmphasis
  /**
   * Shows the notification dot on the avatar. Passed to `Avatar`.
   * @default false
   */
  notification?: boolean
  /** Content for the trailing slot. It takes anything, for example an action button. */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
