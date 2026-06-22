import { forwardRef } from 'react'
import type { AvatarProps } from './Avatar.types'

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = 'lg',
    emphasis = 'low',
    initial,
    notification = false,
    className,
    ...rest
  },
  ref,
) {
  const classes = ['eds-avatar', className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classes}
      data-color-appearance="accent"
      data-size={size}
      data-emphasis={emphasis}
      {...rest}
    >
      {initial && (
        <span
          className="initial"
          data-testid="eds-avatar-initial"
          aria-hidden="true"
        >
          {initial}
        </span>
      )}
      {notification && (
        <span
          className="notification"
          data-testid="eds-avatar-notification"
          data-color-appearance="success"
          aria-hidden="true"
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
