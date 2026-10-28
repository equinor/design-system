import { forwardRef, useContext } from 'react'
import type { AvatarProps } from './Avatar.types'
import { AnnounceNotificationContext, deriveInitials } from './utils'

// Size hints for <img> at comfortable density. The CSS sets the rendered size,
// which follows data-density.
const pixelSizeMap: Record<'sm' | 'md' | 'lg', number> = {
  sm: 20,
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
  const announceNotification = useContext(AnnounceNotificationContext)
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
      data-avatar-size={size}
      data-emphasis={emphasis}
      data-testid="eds-avatar"
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
      {notification && <span className="notification" aria-hidden="true" />}
      {/* Announce notification to screen readers when the div carries no aria-label */}
      {notification && !label && announceNotification && (
        <span className="notification-label">Notification</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
