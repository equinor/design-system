import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

export type FieldProps = {
  /** Sets the id used for the control element */
  controlId?: string
  /** Marks the field as required and propagates to the control */
  required?: boolean
  /** Disables the field and propagates to the control */
  disabled?: boolean
  /** Field content composed of label, description, control, and validation message */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode
  /** Toggle rendering of the required indicator */
  showRequiredIndicator?: boolean
  /** Toggle rendering of the optional indicator when field is not required */
  showOptionalIndicator?: boolean
}

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode
}
