import { forwardRef } from 'react'
import type { AvatarProps } from './Avatar.types'
import { deriveInitials } from './utils'

const pixelSizeMap: Record<'sm' | 'md' | 'lg', number> = {
  sm: 16,
  md: 24,
  lg: 32,
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
  const px = pixelSizeMap[size]

  return (
    <div
      ref={ref}
      className={classes}
      data-color-appearance="accent"
      data-avatar-size={size}
      data-emphasis={emphasis}
      {...a11yProps}
      {...rest}
    >
      {src ? (
        <img
          className="photo"
          src={src}
          alt={alt ?? name ?? ''}
          width={px}
          height={px}
        />
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
      {/* Announce notification to screen readers when the div carries no aria-label */}
      {notification && !label && (
        <span className="notification-label">Notification</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
