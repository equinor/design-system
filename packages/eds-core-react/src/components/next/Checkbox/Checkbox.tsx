/* eslint camelcase: "off" */
import { forwardRef, useEffect, useRef } from 'react'
import {
  checkbox,
  checkbox_outline,
  checkbox_indeterminate,
} from '@equinor/eds-icons'
import { TypographyNext } from '../../Typography'
import { Icon } from '../Icon'
import type { CheckboxProps } from './Checkbox.types'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      disabled = false,
      indeterminate = false,
      error = false,
      className,
      style,
      labelProps,
      wrapperProps,
      ...rest
    },
    ref,
  ) {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, inputRef])

    const baseWrapperClass = classNames('eds-checkbox', className)

    const labelClasses = classNames('eds-checkbox__label')

    const sharedWrapperProps: Record<string, unknown> = {
      style,
      'data-disabled': disabled ? 'true' : undefined,
      'data-selectable-space': 'md',
      'data-space-proportions': 'squished',
      'data-color-appearance': error ? 'danger' : 'accent',
      'data-font-size': 'lg',
      ...wrapperProps,
    }

    const checkboxInput = (
      <span className="eds-checkbox__input-wrapper">
        <input
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : rest.checked}
          aria-disabled={disabled || undefined}
          aria-invalid={error || undefined}
          className="eds-checkbox__input"
          disabled={disabled}
          ref={inputRef}
          data-indeterminate={indeterminate}
          {...rest}
        />
        <Icon
          data={checkbox}
          className="eds-checkbox__icon eds-checkbox__icon--checked"
        />
        <Icon
          data={checkbox_outline}
          className="eds-checkbox__icon eds-checkbox__icon--unchecked"
        />
        <Icon
          data={checkbox_indeterminate}
          className="eds-checkbox__icon eds-checkbox__icon--indeterminate"
        />
      </span>
    )

    if (label) {
      const { className: labelClassName, ...restLabelProps } = labelProps ?? {}

      return (
        <label
          className={classNames(baseWrapperClass, labelClassName)}
          {...sharedWrapperProps}
          {...restLabelProps}
        >
          <span
            className="eds-checkbox__label-wrapper"
            data-horizontal-gap="md"
          >
            {checkboxInput}
            <TypographyNext
              as="span"
              family="ui"
              size="lg"
              baseline="center"
              lineHeight="squished"
              weight="normal"
              tracking="normal"
              className={labelClasses}
            >
              {label}
            </TypographyNext>
          </span>
        </label>
      )
    }

    return (
      <span className={baseWrapperClass} {...sharedWrapperProps}>
        {checkboxInput}
      </span>
    )
  },
)

Checkbox.displayName = 'Checkbox'
