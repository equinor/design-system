import { forwardRef } from 'react'
import { close, check, arrow_drop_down } from '@equinor/eds-icons'
import type { ChipProps } from './Chip.types'
import { Icon } from '../Icon'
import { TypographyNext } from '../../Typography'

export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    tone = 'neutral',
    variant = 'default',
    selected = false,
    deletable = false,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && onClick) {
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
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
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {selected && <Icon data={check} size="sm" aria-hidden className="icon" />}
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
        <Icon data={close} size="sm" aria-hidden className="icon" />
      )}
      {!deletable && dropdown && (
        <Icon data={arrow_drop_down} size="sm" aria-hidden className="icon" />
      )}
    </div>
  )
})

Chip.displayName = 'Chip'
