import type { HTMLAttributes } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarEmphasis = 'high' | 'low'

export type AvatarProps = {
  /** Size of the avatar — sm (16px), md (24px), lg (32px) */
  size?: AvatarSize
  /** Colour emphasis — low uses muted background, high uses emphasis background */
  emphasis?: AvatarEmphasis
  /**
   * Initial(s) displayed in the avatar — intended to be 1–2 characters (e.g.
   * `"A"` or `"AL"`). The span is `aria-hidden`; provide `name` to give
   * screen readers an accessible label. Longer strings are clipped by the circle.
   */
  initial?: string
  /**
   * Full name of the person. Sets `role="img"` and `aria-label` on the avatar
   * so screen readers announce the person's name instead of skipping it.
   * Required when using Avatar standalone — not needed inside `AvatarNameLabel`
   * where the adjacent name text provides context.
   */
  name?: string
  /**
   * Image source URL. When provided, renders a circular photo instead of initials.
   * Pair with `name` or `alt` for accessibility.
   */
  src?: string
  /** Alt text for the image. Falls back to `name` if not provided. Pass `""` explicitly for decorative images. */
  alt?: string
  /** Show a success-tone notification indicator. Announced to screen readers as "Notification" via `role="img"` and `aria-label`. */
  notification?: boolean
} & HTMLAttributes<HTMLDivElement>
