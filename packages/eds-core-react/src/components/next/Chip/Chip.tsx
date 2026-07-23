import { forwardRef } from 'react'
import {
  close,
  check,
  arrow_drop_down,
  arrow_drop_up,
} from '@equinor/eds-icons'
import type { ChipProps } from './Chip.types'
import { Icon } from '../Icon'

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    tone = 'neutral',
    variant = 'default',
    selected = false,
    onDelete,
    dropdown = false,
    onClick,
    children,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const classes = ['eds-chip', className].filter(Boolean).join(' ')
  const deletable = typeof onDelete === 'function'
  const toggleable = !deletable && !dropdown

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (deletable) {
      onDelete?.(event)
    } else {
      onClick?.(event)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (deletable && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault()
      onDelete?.(event)
    }
    onKeyDown?.(event)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      data-variant={variant}
      data-color-appearance={tone}
      data-selectable-space="sm"
      data-selected={selected || undefined}
      aria-pressed={toggleable ? selected : undefined}
      aria-expanded={dropdown ? selected : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {selected && !dropdown && !deletable && (
        <Icon data={check} aria-hidden className="icon" />
      )}
      <span className="label">{children}</span>
      {deletable && <Icon data={close} title="Remove" className="icon" />}
      {!deletable && dropdown && (
        <Icon
          data={selected ? arrow_drop_up : arrow_drop_down}
          aria-hidden
          className="icon"
        />
      )}
    </button>
  )
})

Chip.displayName = 'Chip'
