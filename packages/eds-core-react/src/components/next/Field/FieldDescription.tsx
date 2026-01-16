import { forwardRef, HTMLAttributes } from 'react'
import { TypographyNext } from '../../Typography'

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  const classes = ['eds-field__description', className]
    .filter(Boolean)
    .join(' ')

  return (
    <TypographyNext
      ref={ref}
      as="p"
      className={classes}
      family="ui"
      size="sm"
      lineHeight="default"
      baseline="grid"
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})
