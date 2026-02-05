export * from './Typography'

export { TypographyNext } from './Typography.new'
export { Heading } from './Heading'
export { Paragraph } from './Paragraph'

// Component-specific types
export type { TypographyNextProps } from './Typography.new.types'
export type { HeadingProps } from './Heading.types'
export type { ParagraphProps } from './Paragraph.types'

// Shared typography primitive types
export type {
  FontFamily,
  FontSize,
  LineHeight,
  BaselineAlignment,
  FontWeight,
  Tracking,
} from './types'

// Typography token types
export type {
  TypographyVariants,
  ColorVariants,
  TypographyGroups,
} from './Typography.tokens'
