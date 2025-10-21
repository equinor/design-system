import { HTMLAttributes } from 'react'
import { FontSize, LineHeight, FontWeight, Tracking } from './types'

export type ParagraphProps = {
  /** Size of the text */
  size?: FontSize
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
} & HTMLAttributes<HTMLParagraphElement>
