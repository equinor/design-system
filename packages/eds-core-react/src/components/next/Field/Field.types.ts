import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

export type FieldProps = {
  /**
   * Applies disabled styling to the field and all sub-components.
   * Sets `data-disabled` attribute for CSS styling.
   */
  disabled?: boolean
  /**
   * Enables horizontal layout for toggle inputs (checkbox, radio, switch).
   * When omitted (default), uses vertical layout for standard text inputs.
   * - `start`: Control on the left, label on the right
   * - `end`: Label on the left, control on the right
   */
  position?: 'start' | 'end'
  /** Field content composed of label, description, control, and helper message */
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
  /** The input element to enhance with accessibility props */
  children: ReactNode
}

export type InjectedControlProps = {
  id?: string
  'aria-describedby'?: string
  'aria-required'?: boolean
  disabled?: boolean
}
