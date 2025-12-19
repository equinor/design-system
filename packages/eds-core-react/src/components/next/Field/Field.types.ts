import type {
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  ReactElement,
} from 'react'

export type FieldProps = {
  /** Marks the field as required */
  required?: boolean
  /** Disables all form controls within the field */
  disabled?: boolean
  /** Field content composed of label, description, control, and validation message */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
}

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode
}

export type FieldControlProps = HTMLAttributes<HTMLDivElement> & {
  /** The form control element (input, select, textarea, etc.) */
  children: ReactElement
}
