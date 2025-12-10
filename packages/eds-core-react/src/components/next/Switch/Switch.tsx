import { forwardRef } from 'react'
import { SwitchProps } from './Switch.types'
import './switch.css'
import { TypographyNext } from '../../Typography'

export type { SwitchProps } from './Switch.types'

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, disabled, className, color = 'accent', ...props },
  ref,
) {
  return (
    <label
      className={`eds-switch ${disabled ? 'eds-switch--disabled' : ''} ${
        className || ''
      }`}
      data-color-appearance={props.checked ? color : 'neutral'}
    >
      <input
        type="checkbox"
        className="eds-switch__input"
        disabled={disabled}
        id="eds-switch"
        ref={ref}
        {...props}
      />
      <span className="eds-switch__wrapper" data-font-size="xs">
        <span className="eds-switch__track" />
        <span className="eds-switch__handle" />
      </span>
      <span
        className="eds-switch__hover"
        data-color-appearance="neutral"
        data-vertical-space="sm"
        data-horizontal-space="sm"
      ></span>

      {label && (
        <TypographyNext
          as="span"
          family="ui"
          size="lg"
          baseline="center"
          weight="bolder"
          className="eds-switch__label"
        >
          {label}
        </TypographyNext>
      )}
    </label>
  )
})

Switch.displayName = 'Switch'
