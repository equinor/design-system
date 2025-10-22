import { HTMLAttributes } from 'react'
import { FontSize } from './types'
import { BaseTypographyProps } from './Typography.new.types'

export type ParagraphProps = {
  /** Size of the text */
  size?: FontSize
} & BaseTypographyProps &
  HTMLAttributes<HTMLParagraphElement>
