import { ReactNode, CSSProperties, ComponentPropsWithoutRef } from 'react'
import type { Variants } from '../types'

type ElementComponent = 'input' | 'textarea'

export type InputProps = {
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readOnly?: boolean
  /** Left adornments */
  leftAdornments?: ReactNode
  /** Right adornments */
  rightAdornments?: ReactNode
  /** Left adornments props */
  leftAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Right adornments props */
  rightAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Manually specify left adornments width. The width will be auto-measured if not defined */
  leftAdornmentsWidth?: number
  /** Manually specify right adornments width. The width will be auto-measured if not defined */
  rightAdornmentsWidth?: number
  /** Cast the input to another element */
  as?: ElementComponent
  /** Additional CSS class names to apply to the container */
  className?: string
  /** Inline styles to apply to the container */
  style?: CSSProperties
}
