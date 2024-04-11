// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $capHeightTrim: string
  $baselineTrim: string
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
  }) => css`
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};

    &::before {
      content: '';
      margin-bottom: ${$baselineTrim};
      display: table;
    }

    &::after {
      content: '';
      margin-top: ${$capHeightTrim};
      display: table;
    }
  `}
`
