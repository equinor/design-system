import { forwardRef } from 'react'
import type { AvatarNameLabelProps } from './AvatarNameLabel.types'
import { Avatar } from './Avatar'
import { AnnounceNotificationContext, deriveInitials } from './utils'

export const AvatarNameLabel = forwardRef<HTMLDivElement, AvatarNameLabelProps>(
  function AvatarNameLabel(
    {
      name,
      meta,
      layout = 'horizontal',
      initial,
      src,
      alt,
      size = 'lg',
      emphasis = 'low',
      notification = false,
      notificationLabel = 'Notification',
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const derivedInitial = initial || deriveInitials(name)
    const classes = ['eds-avatar-name-label', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} data-layout={layout} {...rest}>
        <div className="content">
          {/* alt forced to '' so Avatar's own name fallback doesn't announce the name twice — the visible label text already covers it. Initials are always passed, so Avatar can show them if the photo fails to load. */}
          <AnnounceNotificationContext.Provider value={false}>
            <Avatar
              size={size}
              emphasis={emphasis}
              src={src}
              alt={alt ?? ''}
              initial={derivedInitial}
              notification={notification}
            />
          </AnnounceNotificationContext.Provider>
          <div className="names">
            <span className="full-name">{name}</span>
            {meta && <span className="meta">{meta}</span>}
            {/* After the name and meta, so a screen reader reads the person first */}
            {notification && (
              <span className="notification-label">{notificationLabel}</span>
            )}
          </div>
        </div>
        {children && (
          <div className="slot-right" data-testid="eds-avatar-slot-right">
            {children}
          </div>
        )}
      </div>
    )
  },
)

AvatarNameLabel.displayName = 'AvatarNameLabel'
