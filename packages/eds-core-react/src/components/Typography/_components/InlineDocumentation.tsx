// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'
import { StyleHeadingProps } from '../Heading/Heading'
import { TypographySize } from '../typography.types'

const StyledInlineDocumentation = styled.ul`
  font-size: 0.875rem;
  font-family: 'Equinor', sans-serif;
`
export function InlineDocumentation(
  props: StyleHeadingProps & { level: React.ElementType; size: TypographySize },
) {
  const {
    $fontSize,
    $lineHeight,
    $fontFamily,
    $color,
    $trimValues,
    level,
    size,
  } = props
  return (
    <StyledInlineDocumentation>
      <li>size: {size}</li>
      <li>font-size: {`${$fontSize}`}</li>
      <li>line-height: {`${$lineHeight}`}</li>
      <li>font-family: {$fontFamily}</li>
      <li>color: {$color}</li>
      <li>level: {level?.toString()}</li>
      <pre>
        Trim values:
        {JSON.stringify($trimValues, null, 2)}
      </pre>
    </StyledInlineDocumentation>
  )
}
