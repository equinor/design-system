import { forwardRef } from 'react'
import { close, check, arrow_drop_down } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import type { ChipProps } from './Chip.types'
import './chip.css'

/**
 * Chips are compact interactive elements representing an input, attribute,
 * or action. A chip must always be either clickable, deletable, or both.
 *
 * Use the `selected` prop to toggle between default and accent style.
 * When selected, a checkmark icon replaces any leading icon.
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    children,
    onDelete,
    disabled = false,
    selected = false,
    icon,
    dropdown = false,
    onClick,
    className,
    ...rest
  },
  ref,
) {
  if (process.env.NODE_ENV !== 'production') {
    if (!onClick && !onDelete) {
      console.warn(
        'Chip: A chip must have at least one of `onClick` or `onDelete`.',
      )
    }
    if (dropdown && onDelete) {
      console.warn(
        'Chip: `dropdown` and `onDelete` cannot be used together. `onDelete` takes precedence.',
      )
    }
  }

  const handleDelete = disabled ? undefined : onDelete
  const handleClick = disabled ? undefined : onClick

  const deletable = onDelete !== undefined
  const clickable = onClick !== undefined
  const showDropdown = dropdown && !deletable
  const leadingIcon = selected ? check : icon
  const hasIcon = leadingIcon !== undefined

  const classes = ['eds-chip', className].filter(Boolean).join(' ')

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (handleDelete) {
        handleDelete(event)
      } else if (handleClick) {
        handleClick(event as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (handleDelete) {
      handleDelete(event)
    }
  }

  return (
    <div
      ref={ref}
      className={classes}
      data-selected={selected || undefined}
      data-deletable={deletable || undefined}
      data-dropdown={showDropdown || undefined}
      data-has-icon={hasIcon || undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={clickable ? selected : undefined}
      aria-haspopup={showDropdown ? 'menu' : undefined}
      tabIndex={0}
      role={clickable ? 'button' : undefined}
      onClick={handleClick}
      onKeyDown={clickable || deletable ? handleKeyDown : undefined}
      {...rest}
    >
      {hasIcon && <Icon data={leadingIcon} size="xs" />}
      {children}
      {onDelete && (
        <button
          type="button"
          className="eds-chip__delete"
          onClick={handleDeleteClick}
          disabled={disabled}
          aria-label="Remove"
          tabIndex={-1}
        >
          <Icon data={close} size="xs" />
        </button>
      )}
      {showDropdown && (
        <Icon
          data={arrow_drop_down}
          size="xs"
          className="eds-chip__dropdown"
          aria-hidden
        />
      )}
    </div>
  )
})
