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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (deletable) {
      onDelete?.(event)
    } else {
      onClick?.(event)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (deletable) {
        onDelete?.(event as unknown as React.MouseEvent<HTMLElement>)
      } else if (onClick) {
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }
    onKeyDown?.(event)
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
      onClick={handleClick}
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
      {deletable && <Icon data={close} title="Remove" className="icon" />}
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
