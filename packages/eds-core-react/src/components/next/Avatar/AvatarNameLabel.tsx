import { forwardRef } from 'react'
import type { AvatarNameLabelProps } from './AvatarNameLabel.types'
import { Avatar } from './Avatar'

export const AvatarNameLabel = forwardRef<HTMLDivElement, AvatarNameLabelProps>(
  function AvatarNameLabel(
    {
      fullName,
      email,
      layout = 'horizontal',
      initial,
      size = 'lg',
      emphasis = 'low',
      notification = false,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const derivedInitial = initial ?? (fullName?.[0]?.toUpperCase() || 'A')
    const classes = ['eds-avatar-name-label', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} data-layout={layout} {...rest}>
        <div className="content">
          <Avatar
            size={size}
            emphasis={emphasis}
            initial={derivedInitial}
            notification={notification}
          />
          <div className="names">
            <span className="full-name">{fullName}</span>
            {email && (
              <span className="email" data-testid="eds-avatar-email">
                {email}
              </span>
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
