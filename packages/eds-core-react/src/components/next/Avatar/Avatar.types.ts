import type { HTMLAttributes } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarEmphasis = 'high' | 'low'

export type AvatarProps = {
  /** Size of the avatar — sm (16px), md (24px), lg (32px) */
  size?: AvatarSize
  /** Colour emphasis — low uses muted background, high uses emphasis background */
  emphasis?: AvatarEmphasis
  /**
   * Initial letter displayed in the avatar. The span is `aria-hidden` — the
   * letter is decorative. For standalone use as a meaningful image, also pass
   * `role="img"` and `aria-label` with the person's name.
   */
  initial?: string
  /** Show a success-tone notification indicator */
  notification?: boolean
} & HTMLAttributes<HTMLDivElement>
