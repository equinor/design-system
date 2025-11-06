import {
  ReactNode,
  CSSProperties,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react'
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
  /** Manually specify left adornments width. The width will be the dom element width if not defined */
  leftAdornmentsWidth?: number
  /**  Manually specify right adornments width. The width will be the dom element width if not defined */
  rightAdornmentsWidth?: number
  /** Cast the input to another element */
  as?: ElementComponent
  /**  */
  className?: string
  style?: CSSProperties
}
