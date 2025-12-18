import { ReactNode, HTMLAttributes } from 'react'

export type FieldProps = {
  /** Field content - Label, Description, Input, ValidationMessage */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>
