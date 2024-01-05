export type AccordionProps = {
  /** The header level, i.e. h1, h2, h3 etc. Note: This only changes the element type, the style is the same for all headerlevels */
  headerLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Which side the chevron should be on  */
  chevronPosition?: 'left' | 'right'
}
