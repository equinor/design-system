/* eslint camelcase: "off" */
import { forwardRef, useEffect, useRef } from 'react'
import {
  checkbox,
  checkbox_outline,
  checkbox_indeterminate,
} from '@equinor/eds-icons'
import { TypographyNext } from '../../Typography'
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

    const iconClasses = classNames('eds-checkbox__icon')

    const sharedWrapperProps: Record<string, unknown> = {
      style,
      'data-disabled': disabled ? 'true' : undefined,
    }

    if (error) {
      sharedWrapperProps['data-color-appearance'] = 'danger'
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
        {indeterminate ? (
          <svg
            className={iconClasses}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              className="eds-checkbox__icon-path eds-checkbox__icon-path--indeterminate"
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                Array.isArray(checkbox_indeterminate.svgPathData)
                  ? checkbox_indeterminate.svgPathData.join(' ')
                  : checkbox_indeterminate.svgPathData
              }
            />
          </svg>
        ) : (
          <svg
            className={iconClasses}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              className="eds-checkbox__icon-path eds-checkbox__icon-path--checked"
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                Array.isArray(checkbox.svgPathData)
                  ? checkbox.svgPathData.join(' ')
                  : checkbox.svgPathData
              }
            />
            <path
              className="eds-checkbox__icon-path eds-checkbox__icon-path--unchecked"
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                Array.isArray(checkbox_outline.svgPathData)
                  ? checkbox_outline.svgPathData.join(' ')
                  : checkbox_outline.svgPathData
              }
            />
          </svg>
        )}
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
          <span className="eds-checkbox__label-wrapper">
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
