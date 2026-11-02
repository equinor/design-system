import { forwardRef, useContext, useState } from 'react'
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
    notificationLabel = 'Notification',
    className,
    ...rest
  },
  ref,
) {
  const announceNotification = useContext(AnnounceNotificationContext)
  // Keyed on src, so a new src gets a fresh try without an effect
  const [failedSrc, setFailedSrc] = useState<string>()
  const showPhoto = Boolean(src) && src !== failedSrc
  const classes = ['eds-avatar', className].filter(Boolean).join(' ')
  // || rather than ??, so an empty initial also falls back to the name
  const resolvedInitial = initial || (name ? deriveInitials(name) : undefined)
  // When the photo shows, the <img> element carries the accessible name — skip role/aria-label on the div
  const label =
    !showPhoto && name
      ? notification
        ? `${name}, ${notificationLabel}`
        : name
      : undefined
  const a11yProps = label ? { role: 'img' as const, 'aria-label': label } : {}
  const px = pixelSizeMap[size]

  return (
    <div
      ref={ref}
      className={classes}
      data-size={size}
      data-emphasis={emphasis}
      data-testid="eds-avatar"
      {...a11yProps}
      {...rest}
    >
      {showPhoto ? (
        <img
          className="photo"
          src={src}
          alt={alt ?? name ?? ''}
          width={px}
          height={px}
          onError={() => setFailedSrc(src)}
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
        <span className="notification-label">{notificationLabel}</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
