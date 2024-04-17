// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $capHeightTrim: string
  $baselineTrim: string
  $offset?: number
}

export const Typography = styled.p<StyleHeadingProps>`
  font-weight: 400;
  margin: 0;
  ${({
    $fontFamily,
    $fontSize,
    $lineHeight,
    $capHeightTrim,
    $baselineTrim,
    $offset = 0,
  }) => css`
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
    --offset-equinor: 0.05em;
    --_offset: calc(${$offset} * 1em);

    &::before {
      content: '';
      margin-bottom: ${$baselineTrim};
      /*emulate texbox-trim*/
      margin-bottom: calc((((1lh - 1cap) / 2) - var(--_offset, 0em)) * -1);
      display: table;
      /*use padding to round off textbox height to multiples of 4 in supported browsers */
      @supports (height: round(10px, 1px)) {
        --_rest: calc((round(up, 1cap, 4px) - 1cap) / 2);
        padding-top: var(--_rest);
        padding-bottom: var(--_rest);
      }
    }

    &::after {
      content: '';
      margin-top: ${$capHeightTrim};
      /*emulate texbox-trim*/
      margin-top: calc((((1lh - 1cap) / 2) + var(--_offset, 0em)) * -1);
      display: table;
    }
  `}
`
