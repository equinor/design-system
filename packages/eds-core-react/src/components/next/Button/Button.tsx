import { forwardRef, Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import type { ButtonProps } from './Button.types'

const SIZE_MAPPING = {
  small: 'sm',
  default: 'md',
  large: 'lg',
} as const

const sizeToSelectableSpace = SIZE_MAPPING

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'default',
      tone = 'accent',
      icon = false,
      round = false,
      multiline = false,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const classes = ['eds-button', className].filter(Boolean).join(' ')
    const selectableSpace = sizeToSelectableSpace[size]

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        data-variant={variant}
        data-selectable-space={selectableSpace}
        data-space-proportions="squished"
        data-color-appearance={disabled ? 'neutral' : tone}
        data-icon-only={icon || undefined}
        data-round={icon && round ? true : undefined}
        data-multiline={multiline || undefined}
        {...rest}
      >
        {(() => {
          const out: ReactNode[] = []
          let buf: ReactNode[] = []
          Children.toArray(children).forEach((child, i) => {
            const isLabelNode =
              typeof child === 'string' ||
              typeof child === 'number' ||
              (isValidElement(child) && child.type === 'br')
            if (isLabelNode) {
              buf.push(child)
            } else {
              if (buf.length) {
                out.push(
                  <span key={`label-${i}`} className="eds-button__label">
                    {buf}
                  </span>,
                )
                buf = []
              }
              out.push(child)
            }
          })
          if (buf.length) {
            out.push(
              <span key="label-end" className="eds-button__label">
                {buf}
              </span>,
            )
          }
          return out
        })()}
      </button>
    )
  },
)

Button.displayName = 'Button'
