import { forwardRef, useEffect } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldDescriptionProps } from './Field.types'
import { useFieldContext } from './Field.context'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  const { descriptionId, setHasDescription } = useFieldContext()

  useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <TypographyNext
      ref={ref}
      as="p"
      id={descriptionId}
      family="ui"
      size="md"
      baseline="center"
      lineHeight="default"
      tracking="normal"
      className={['eds-field__description', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

FieldDescription.displayName = 'Field.Description'
