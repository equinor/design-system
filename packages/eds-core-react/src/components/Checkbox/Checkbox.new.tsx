/* eslint camelcase: "off" */
import { forwardRef, useEffect, useRef } from 'react'
import {
  checkbox,
  checkbox_outline,
  checkbox_indeterminate,
} from '@equinor/eds-icons'
import { TypographyNext } from '../Typography'
import type { CheckboxProps } from './Checkbox.new.types'
import './checkbox.new.css'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      disabled = false,
      indeterminate = false,
      className,
      style,
      labelProps,
      ...rest
    },
    ref,
  ) {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

    // Set indeterminate state via JavaScript (can't be done via HTML attribute)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, inputRef])

    const wrapperClasses = classNames(
      'checkbox',
      disabled && 'checkbox--disabled',
      className,
    )

    const labelClasses = classNames(
      'checkbox__label',
      disabled && 'checkbox__label--disabled',
    )

    const iconClasses = classNames(
      'checkbox__icon',
      disabled && 'checkbox__icon--disabled',
    )

    const checkboxInput = (
      <span className="checkbox__input-wrapper">
        <input
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : rest.checked}
          aria-disabled={disabled || undefined}
          className="checkbox__input"
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
              className="checkbox__icon-path checkbox__icon-path--indeterminate"
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
              className="checkbox__icon-path checkbox__icon-path--checked"
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                Array.isArray(checkbox.svgPathData)
                  ? checkbox.svgPathData.join(' ')
                  : checkbox.svgPathData
              }
            />
            <path
              className="checkbox__icon-path checkbox__icon-path--unchecked"
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
      return (
        <label className={wrapperClasses} style={style} {...labelProps}>
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
        </label>
      )
    }

    return (
      <span className={wrapperClasses} style={style}>
        {checkboxInput}
      </span>
    )
  },
)

Checkbox.displayName = 'Checkbox'
