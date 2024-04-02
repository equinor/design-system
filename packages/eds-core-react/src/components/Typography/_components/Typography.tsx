// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $color: string
  $trimValues: {
    capHeightTrim: string
    baselineTrim: string
  }
}

export const Typography = styled.p<StyleHeadingProps>`
  font-weight: 400;
  margin: 0;
  ${({ $fontFamily, $fontSize, $lineHeight, $color, $trimValues }) => css`
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
    color: ${$color};

    &::before {
      content: '';
      margin-bottom: ${$trimValues.capHeightTrim};
      display: table;
    }

    &::after {
      content: '';
      margin-top: ${$trimValues.baselineTrim};
      display: table;
    }
  `}
`
