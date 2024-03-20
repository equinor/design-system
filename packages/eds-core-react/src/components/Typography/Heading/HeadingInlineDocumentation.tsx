// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'
import { StyleHeadingProps } from './Heading'
import { TypographySize } from './heading.types'

const StyledHeadingInlineDocumentation = styled.ul`
  font-size: 0.875rem;
  font-family: 'Equinor', sans-serif;
`
export function HeadingInlineDocumentation(
  props: StyleHeadingProps & { level: React.ElementType; size: TypographySize },
) {
  const {
    $fontSize,
    $lineHeight,
    $fontFamily,
    $color,
    $capsizeStyles,
    level,
    size,
  } = props
  return (
    <StyledHeadingInlineDocumentation>
      <li>size: {size}</li>
      <li>font-size: {`${$fontSize}`}</li>
      <li>line-height: {`${$lineHeight}`}</li>
      <li>font-family: {$fontFamily}</li>
      <li>color: {$color}</li>
      <li>level: {level?.toString()}</li>
      <p>
        capsize styles:
        {JSON.stringify($capsizeStyles)}
      </p>
    </StyledHeadingInlineDocumentation>
  )
}
