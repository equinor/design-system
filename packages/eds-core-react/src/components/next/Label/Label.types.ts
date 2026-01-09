import { ReactNode, LabelHTMLAttributes } from 'react'

export type LabelProps = {
  /** Label text */
  label: ReactNode
  /** Mark field as optional - shows "(Optional)" */
  optional?: boolean
  /** Mark field as required - shows "(Required)" */
  required?: boolean
  /** Info tooltip content - shows (i) icon that displays tooltip on hover/focus */
  info?: ReactNode
} & LabelHTMLAttributes<HTMLLabelElement>
