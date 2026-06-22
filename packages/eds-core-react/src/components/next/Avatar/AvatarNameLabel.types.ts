import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarEmphasis, AvatarSize } from './Avatar.types'

export type AvatarNameLabelLayout = 'horizontal' | 'vertical'

export type AvatarNameLabelProps = {
  /** Full name displayed as the primary label */
  fullName: string
  /** Secondary label, typically email or a metadata string */
  email?: string
  /** Layout direction — horizontal stacks name/email, vertical places them inline */
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
