import { HTMLAttributes } from 'react'
import { BaseTypographyProps } from './Typography.new.types'

export type HeadingProps = {
  /** HTML heading element to render */
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & BaseTypographyProps &
  HTMLAttributes<HTMLHeadingElement>
