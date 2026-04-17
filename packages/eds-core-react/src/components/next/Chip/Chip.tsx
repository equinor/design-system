import { forwardRef } from 'react'
import { close, check, arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'
import type { ChipProps } from './Chip.types'
import { Icon } from '../Icon'
import { TypographyNext } from '../../Typography'

export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && onClick) {
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
    }
    if (deletable && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault()
      onDelete?.(event as unknown as React.MouseEvent<HTMLElement>)
    }
    onKeyDown?.(event)
  }

  const handleDelete = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    onDelete?.(event)
  }

  return (
    <div
      ref={ref}
      className={classes}
      data-variant={variant}
      data-color-appearance={tone}
      data-font-family="ui"
      data-font-size="md"
      data-selectable-space="sm"
      data-space-proportions="squished"
      data-selected={selected || undefined}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {selected && !dropdown && !deletable && (
        <Icon data={check} aria-hidden className="icon" />
      )}
      <TypographyNext
        as="span"
        className="label"
        family="ui"
        size="md"
        lineHeight="squished"
        baseline="center"
      >
        {children}
      </TypographyNext>
      {deletable && (
        <span className="delete" aria-hidden onClick={handleDelete}>
          <Icon data={close} className="icon" />
        </span>
      )}
      {!deletable && dropdown && (
        <Icon
          data={selected ? arrow_drop_up : arrow_drop_down}
          aria-hidden
          className="icon"
        />
      )}
    </div>
  )
})

Chip.displayName = 'Chip'
