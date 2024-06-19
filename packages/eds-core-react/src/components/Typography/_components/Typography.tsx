import { HTMLAttributes, AnchorHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import {
  TypographySize,
  TypographyLineHeight,
  TypographyElement,
  TypographyFontWeight,
  TypographyLetterSpacing,
} from '../typography.types'

export type StyleHeadingProps = {
  $type: TypographyElement
  $size: TypographySize
  $lineHeight: TypographyLineHeight
  $fontWeight: TypographyFontWeight
  $letterSpacing: TypographyLetterSpacing
  $offset?: number
  $onGrid?: boolean
  $color?: string
} & (HTMLAttributes<HTMLElement> | AnchorHTMLAttributes<HTMLAnchorElement>)

export const Typography = styled.p<StyleHeadingProps>`
  margin: 0;
  ${({
    $type,
    $size,
    $lineHeight,
    $fontWeight,
    $letterSpacing,
    $offset = 0,
    $onGrid = true,
    $color,
  }) => css`
    /*temporary rounding for testing*/
    --_rounding: var(--rounding, nearest);
    --_text-preset-color: ${$color};
    font-family: ${`var(--eds-typography-${$type}-font-family)`};
    font-size: ${`var(--eds-typography-${$type}-${$size}-font-size)`};
    line-height: ${`var(--eds-typography-${$type}-${$size}-lineheight-${$lineHeight})`};
    font-weight: ${`var(--eds-typography-${$type}-${$size}-font-weight-${$fontWeight})`};
    letter-spacing: ${`var(--eds-typography-${$type}-${$size}-tracking-${$letterSpacing})`};
    //how to calculate unitless line-height rounded to 4px in css
    //line-height: round(1em * 1.5, 4px);
    color: var(--_text-preset-color, inherit);
    //background-color: rgb(255 0 0 / 0.3);
    --_offset: calc(${$offset} * 1em);
    --_grid-base: 4px;
    //style links this way using token color?
    /* &[href],
    & [href] {
      color: var(--custom-color-link, var(--eds-whatever-the-link-color-token-is));
    } */

    @supports (height: round(up, 10px, 1px)) {
      /*This calculates the rest-values to make the total height rounded to 4px.
      When onGrid is true, the rest is only added to the top of the text-box.*/
      --_rest-top: ${$onGrid
        ? 'calc(round(var(--_rounding), 1cap, var(--_grid-base)) - 1cap)'
        : 'calc((round(var(--_rounding), 1cap, var(--_grid-base)) - 1cap) / 2)'};
      --_rest-bottom: ${$onGrid
        ? '0cap'
        : 'calc((round(var(--_rounding), 1cap, var(--_grid-base)) - 1cap) / 2)'};
    }

    /*This emulates text-box-trim: both; text-box-edge: cap alphabetic*/
    --_trim-top: calc(((((1lh - 1cap) / 2) - var(--_offset)) * -1));
    --_trim-bottom: calc(((((1lh - 1cap) / 2) + var(--_offset)) * -1));

    &::before {
      //Because of the negative margins, margin-bottom adjusts the top and vice versa
      margin-bottom: calc(var(--_trim-top) + var(--_rest-top, 0cap));
    }
    &::after {
      margin-top: calc(var(--_trim-bottom) + var(--_rest-bottom, 0cap));
    }
    &::before,
    &::after {
      display: table;
      content: '';
    }
  `}
`
