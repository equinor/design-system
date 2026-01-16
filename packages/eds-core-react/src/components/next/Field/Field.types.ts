import { ReactNode, HTMLAttributes } from 'react'

export type FieldProps = {
  /** Field content - Label, Description, Input, HelperMessage */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>
