import type { HTMLAttributes } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarEmphasis = 'high' | 'low'

export type AvatarProps = {
  /**
   * Size of the avatar: `sm` (20px), `md` (24px) or `lg` (32px) at comfortable
   * density. Like other components, it follows `data-density` on an ancestor.
   * @default 'lg'
   */
  size?: AvatarSize
  /**
   * Colour emphasis. `low` uses the muted accent background and `high` the
   * emphasis accent background.
   * @default 'low'
   */
  emphasis?: AvatarEmphasis
  /**
   * Initial(s) displayed in the avatar, intended to be 1 or 2 characters (e.g.
   * `"A"` or `"AL"`). The span is `aria-hidden`; provide `name` to give
   * screen readers an accessible label. Longer strings are clipped by the circle.
   */
  initial?: string
  /**
   * Full name of the person. Sets `role="img"` and `aria-label` on the avatar
   * so screen readers announce the person's name instead of skipping it.
   * Required when using Avatar standalone. Not needed inside `AvatarNameLabel`,
   * where the adjacent name text provides context.
   */
  name?: string
  /**
   * Image source URL. When provided, renders a circular photo instead of initials.
   * If the photo fails to load, the initials show instead.
   * Pair with `name` or `alt` for accessibility.
   */
  src?: string
  /** Alt text for the image. Falls back to `name` if not provided. Pass `""` explicitly for decorative images. */
  alt?: string
  /**
   * Show a red notification dot at the bottom-right corner. With `name` and
   * initials, `notificationLabel` is added to the `aria-label` (e.g. `"Ada
   * Lovelace, Notification"`). With a photo or without `name`, it is read out
   * as visually hidden text instead.
   * @default false
   */
  notification?: boolean
  /**
   * Text screen readers announce for the notification dot. Override for
   * localisation.
   * @default 'Notification'
   */
  notificationLabel?: string
} & HTMLAttributes<HTMLDivElement>
