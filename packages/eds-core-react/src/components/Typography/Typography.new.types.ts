import { HTMLAttributes } from 'react'
import {
  FontFamily,
  FontSize,
  LineHeight,
  BaselineAlignment,
  FontWeight,
  Tracking,
} from './types'

export type TypographyNextProps = {
  /** Font family */
  family: FontFamily
  /** Size of the text */
  size: FontSize
  /** Line height variant */
  lineHeight: LineHeight
  /** Baseline alignment strategy */
  baseline: BaselineAlignment
  /** Font weight */
  weight: FontWeight
  /** Letter spacing (tracking) */
  tracking: Tracking
  /** Enable debug mode to visualize text box */
  debug?: boolean
  /** Children to render */
  children?: React.ReactNode
} & HTMLAttributes<HTMLElement>
