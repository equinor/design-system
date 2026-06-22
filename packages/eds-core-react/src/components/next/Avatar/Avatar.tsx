import { forwardRef } from 'react'
import type { AvatarProps } from './Avatar.types'

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = 'lg',
    emphasis = 'low',
    initial = 'A',
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
      <span className="initial">{initial}</span>
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
