// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { forwardRef } from 'react'

// TODO: This should be imported from tokens when we have defined these font families
export const HEADING_FONT_FAMILY = {
  h1: 'Equinor, sans-serif',
  h2: 'Equinor, sans-serif',
  h3: 'Equinor, sans-serif',
  h4: 'Inter, Arial, sans-serif',
  h5: 'Inter, Arial, sans-serif',
  h6: 'Inter, Arial, sans-serif',
}

export type TypographySize = '3XS' | '2XS' | 'XS' | 'SM' | 'BASE' | 'LG'
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps = {
  size?: TypographySize
  as?: React.ElementType
  children?: React.ReactNode
  isDocumentationVisible?: boolean
}

const getFontSize = (size: TypographySize): number => {
  switch (size) {
    case '3XS':
      return 10.5
    case '2XS':
      return 12
    case 'XS':
      return 16
    case 'SM':
      return 21
    case 'BASE':
      return 28
    case 'LG':
      return 37
    default:
      return 28
  }
}

const getLineHeightMultiplier = (size: TypographySize): number => {
  switch (size) {
    case '3XS':
    case '2XS':
    case 'XS':
      return 1.25
    case 'SM':
    case 'BASE':
    case 'LG':
      return 1.1
  }
}

const getLevelBySize = (size: TypographySize): HeadingLevel => {
  switch (size) {
    case '3XS':
      return 'h6'
    case '2XS':
      return 'h5'
    case 'XS':
      return 'h4'
    case 'SM':
      return 'h3'
    case 'BASE':
      return 'h2'
    case 'LG':
      return 'h1'
    default:
      return 'h1'
  }
}

const getColor = (size: TypographySize): string => {
  const level = getLevelBySize(size)
  return tokens.typography.heading?.[level]?.color
}

const getFontFamily = (size: TypographySize): string => {
  const level = getLevelBySize(size)
  return HEADING_FONT_FAMILY[level]
  // TODO: Should be replaced with tokens
  // return tokens.typography.heading?.[level]?.fontFamily
}

const calculateLineHeight = ({
  fontSize,
  lineHeightMultiplier,
}: {
  fontSize: number
  lineHeightMultiplier: number
}): number => {
  return 4 * Math.round((fontSize * lineHeightMultiplier) / 4)
}

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $color: string
}

const StyledHeading = styled.h1<StyleHeadingProps>`
  font-weight: 400;
  margin: 0;
  ${({ $fontFamily, $fontSize, $lineHeight, $color }) => `
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
    color: ${$color};
`}
`

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(props, ref) {
    const size = props.size || 'BASE'
    const fontFamily = getFontFamily(size)
    const fontSize = getFontSize(size)
    const lineHeightMultiplier = getLineHeightMultiplier(size)
    const lineHeight = calculateLineHeight({
      fontSize,
      lineHeightMultiplier,
    })
    const color = getColor(size)
    const level = props.as ?? 'h1'

    return (
      <StyledHeading
        ref={ref}
        as={level}
        $fontSize={`${fontSize}px`}
        $lineHeight={`${lineHeight}px`}
        $fontFamily={fontFamily}
        $color={color}
      >
        {props.isDocumentationVisible && (
          <HeadingInlineDocumentation
            size={size}
            $fontSize={`${fontSize}px`}
            $lineHeight={`${lineHeight}px`}
            $fontFamily={fontFamily}
            $color={color}
            level={level}
          />
        )}
        {props.children}
      </StyledHeading>
    )
  },
)

const StyledHeadingInlineDocumentation = styled.ul`
  font-size: 0.875rem;
  font-family: 'Equinor', sans-serif;
`

function HeadingInlineDocumentation(
  props: StyleHeadingProps & { level: React.ElementType; size: TypographySize },
) {
  const { $fontSize, $lineHeight, $fontFamily, $color, level, size } = props
  return (
    <StyledHeadingInlineDocumentation>
      <li>size: {size}</li>
      <li>font-size: {`${$fontSize}`}</li>
      <li>line-height: {`${$lineHeight}`}</li>
      <li>font-family: {$fontFamily}</li>
      <li>color: {$color}</li>
      <li>level: {level?.toString()}</li>
    </StyledHeadingInlineDocumentation>
  )
}
