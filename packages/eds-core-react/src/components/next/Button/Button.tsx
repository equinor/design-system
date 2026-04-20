import { forwardRef, Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import type { ButtonProps } from './Button.types'
import { Slot } from '../Slot'

const SIZE_MAPPING = {
  small: 'sm',
  default: 'md',
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
      asChild,
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

    const sharedProps = {
      ref,
      className: classes,
      disabled,
      'data-variant': variant,
      'data-selectable-space': selectableSpace,
      'data-space-proportions': 'squished' as const,
      'data-color-appearance': disabled ? 'neutral' : tone,
      'data-icon-only': icon || undefined,
      'data-round': icon && round ? true : undefined,
      ...rest,
    }

    if (asChild) {
      return <Slot {...sharedProps}>{children}</Slot>
    }

    return (
      <button
        type={type}
        data-multiline={multiline || undefined}
        {...sharedProps}
      >
        {(() => {
          const out: ReactNode[] = []
          let buf: ReactNode[] = []
          let labelGroupIndex = 0
          Children.toArray(children).forEach((child) => {
            const isLabelNode =
              typeof child === 'string' ||
              typeof child === 'number' ||
              (isValidElement(child) && child.type === 'br')
            if (isLabelNode) {
              buf.push(child)
            } else {
              if (buf.length) {
                out.push(
                  <span key={`label-${labelGroupIndex++}`} className="label">
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
              <span key="label-end" className="label">
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
