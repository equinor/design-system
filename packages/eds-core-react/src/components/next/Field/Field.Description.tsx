import { forwardRef, useEffect, useRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldDescriptionProps } from './Field.types'
import { useFieldContext } from './Field.context'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  const { descriptionId, setHasDescription, hasDescription } = useFieldContext()
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      hasDescription &&
      !hasRegistered.current
    ) {
      console.warn(
        'Field.Description: Multiple Description components detected within the same Field. ' +
          'Only one Description per Field is supported.',
      )
    }
    hasRegistered.current = true
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription, hasDescription])

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
      className={['eds-field__description', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

FieldDescription.displayName = 'Field.Description'
