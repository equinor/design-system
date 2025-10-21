import { HTMLAttributes } from 'react'
import { FontWeight, Tracking } from './types'

export type HeadingProps = {
  /** HTML heading element to render */
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Font weight */
  weight?: FontWeight
  /** Letter spacing (tracking) */
  tracking?: Tracking
  /** Enable debug mode to visualize text box */
  debug?: boolean
  /** Children to render */
  children?: React.ReactNode
} & HTMLAttributes<HTMLHeadingElement>
