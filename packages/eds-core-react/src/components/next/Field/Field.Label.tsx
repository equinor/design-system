import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldLabelProps } from './Field.types'
import { useFieldContext } from './Field.context'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ children, className, indicator, ...rest }, ref) {
    const { id, labelId } = useFieldContext()

    return (
      <TypographyNext
        ref={ref}
        as="label"
        id={labelId}
        htmlFor={id}
        family="ui"
        size="lg"
        baseline="center"
        lineHeight="default"
        weight="normal"
        tracking="normal"
        className={['eds-field__label', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
        {indicator && <span className="eds-field__indicator">{indicator}</span>}
      </TypographyNext>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
