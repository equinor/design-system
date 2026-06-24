import { forwardRef } from 'react'
import type { AvatarNameLabelProps } from './AvatarNameLabel.types'
import { Avatar } from './Avatar'

function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (!words[0]) return ''
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

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
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const derivedInitial = initial ?? deriveInitials(name)
    const classes = ['eds-avatar-name-label', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} data-layout={layout} {...rest}>
        <div className="content">
          <Avatar
            size={size}
            emphasis={emphasis}
            src={src}
            alt={alt ?? ''}
            initial={src ? undefined : derivedInitial}
            notification={notification}
          />
          <div className="names">
            <span className="full-name">{name}</span>
            {meta && <span className="meta">{meta}</span>}
            {notification && (
              <span className="notification-label">Notification</span>
            )}
          </div>
        </div>
        {children && <div className="slot-right">{children}</div>}
      </div>
    )
  },
)

AvatarNameLabel.displayName = 'AvatarNameLabel'
