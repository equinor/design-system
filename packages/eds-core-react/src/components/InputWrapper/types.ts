import { ReactNode } from 'react'
import type { Variants } from '../types'

/**
 * Base props shared by all input field components (TextField, Textarea, etc.)
 */
export type BaseInputFieldProps = {
  /** Variants */
  variant?: Variants
  /** Input unique id. If this is not provided, one will be generated */
  id?: string
  /** Label text */
  label?: ReactNode
  /** Meta text */
  meta?: ReactNode
  /** Helper text */
  helperText?: string
  /** InputIcon */
  inputIcon?: ReactNode
  /** HelperIcon */
  helperIcon?: ReactNode
}
