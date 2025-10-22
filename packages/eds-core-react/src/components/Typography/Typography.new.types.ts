import { HTMLAttributes, ElementType } from 'react'
import {
  FontFamily,
  FontSize,
  LineHeight,
  BaselineAlignment,
  FontWeight,
  Tracking,
} from './types'

/**
 * Base typography props shared across typography components.
 * Can be extended for specific typography component needs.
 */
export type BaseTypographyProps = {
  /** Line height variant */
  lineHeight?: LineHeight
  /** Font weight */
  weight?: FontWeight
  /** Letter spacing (tracking) */
  tracking?: Tracking
  /** Enable debug mode to visualize text box */
  debug?: boolean
  /** Children to render */
  children?: React.ReactNode
}

export type TypographyNextProps = {
  /** Font family */
  family: FontFamily
  /** Size of the text */
  size: FontSize
  /** Baseline alignment strategy */
  baseline: BaselineAlignment
  /** Semantic HTML element to render. Defaults to 'span' */
  as?: ElementType
} & BaseTypographyProps &
  HTMLAttributes<HTMLElement>
