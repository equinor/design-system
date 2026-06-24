import { forwardRef } from 'react'
import type { AvatarProps } from './Avatar.types'

export function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = 'lg',
    emphasis = 'low',
    initial,
    name,
    src,
    alt,
    notification = false,
    className,
    ...rest
  },
  ref,
) {
  const classes = ['eds-avatar', className].filter(Boolean).join(' ')
  const resolvedInitial = initial ?? (name ? deriveInitials(name) : undefined)
  // When src is provided the <img> element carries the accessible name — skip role/aria-label on the div
  const label =
    !src && name ? (notification ? `${name}, notification` : name) : undefined
  const a11yProps = label ? { role: 'img' as const, 'aria-label': label } : {}

  return (
    <div
      ref={ref}
      className={classes}
      data-color-appearance="accent"
      data-size={size}
      data-emphasis={emphasis}
      {...a11yProps}
      {...rest}
    >
      {src ? (
        <img className="photo" src={src} alt={alt ?? name ?? ''} />
      ) : (
        resolvedInitial && (
          <span className="initial" aria-hidden="true">
            {resolvedInitial}
          </span>
        )
      )}
      {notification && (
        <span
          className="notification"
          data-color-appearance="success"
          aria-hidden="true"
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
