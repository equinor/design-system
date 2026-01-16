import { forwardRef } from 'react'
import { info_circle } from '@equinor/eds-icons'
import type { LabelProps } from './Label.types'
import { TypographyNext } from '../../Typography'
import { Tooltip } from '../../Tooltip'
import { Icon } from '../Icon'

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { label, optional = false, required = false, info, className, ...rest },
  ref,
) {
  const classes = ['eds-label', className].filter(Boolean).join(' ')

  // Determine which indicator to show (required takes precedence if both are set)
  const indicator = required ? '(Required)' : optional ? '(Optional)' : null

  const labelElement = (
    <TypographyNext
      ref={ref}
      as="label"
      family="ui"
      size="lg"
      lineHeight="squished"
      baseline="center"
      {...rest}
    >
      {label}
      {indicator && (
        <span className="eds-label__indicator" data-font-size="sm">
          {indicator}
        </span>
      )}
    </TypographyNext>
  )

  if (!info) {
    return <div className={classes}>{labelElement}</div>
  }

  return (
    <div className={classes}>
      {labelElement}
      <Tooltip title={info} placement="top">
        <button
          type="button"
          className="eds-label__info"
          aria-label="More information"
        >
          <Icon data={info_circle} size="xs" />
        </button>
      </Tooltip>
    </div>
  )
})
