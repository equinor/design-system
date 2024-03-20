export type TypographySize = '3XS' | '2XS' | 'XS' | 'SM' | 'BASE' | 'LG'
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type CapsizeStyles = {
  fontSize: string
  lineHeight: string
  '::before': {
    content: string
    marginBottom: string
    display: string
  }
  '::after': {
    content: string
    marginTop: string
    display: string
  }
}
