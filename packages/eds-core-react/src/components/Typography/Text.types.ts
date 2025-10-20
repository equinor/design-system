import { HTMLAttributes } from 'react'

export type FontFamily = 'ui' | 'header'

export type FontSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

export type LineHeight = 'default' | 'squished'

export type BaselineAlignment = 'grid' | 'center'

export type FontWeight = 'lighter' | 'normal' | 'bolder'

export type Tracking = 'tight' | 'normal' | 'loose'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-large'
  | 'body'
  | 'body-small'
  | 'caption'
  | 'overline'

export type TextProps = {
  /** Font family */
  family?: FontFamily
  /** Size of the text */
  size?: FontSize
  /** Line height variant */
  lineHeight?: LineHeight
  /** Baseline alignment strategy */
  baseline?: BaselineAlignment
  /** Font weight */
  weight?: FontWeight
  /** Letter spacing (tracking) */
  tracking?: Tracking
  /** Predefined typography variant (overrides individual props) */
  variant?: TypographyVariant
  /** Enable debug mode to visualize text box */
  debug?: boolean
  /** Children to render */
  children?: React.ReactNode
} & HTMLAttributes<HTMLElement>

export type HeadingProps = Omit<
  TextProps,
  'variant' | 'size' | 'lineHeight' | 'family'
> & {
  /** HTML element to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & HTMLAttributes<HTMLHeadingElement>

export type ParagraphProps = Omit<TextProps, 'variant' | 'family'> &
  HTMLAttributes<HTMLParagraphElement>
