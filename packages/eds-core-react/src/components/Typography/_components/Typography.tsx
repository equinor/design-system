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
  $lines?: number
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
    $lines,
  }) => css`
    ${$lines &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${$lines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
    --_text-preset-color: ${$color};
    font-family: ${`var(--eds-typography-${$type}-font-family)`};
    font-size: ${`var(--eds-typography-${$type}-${$size}-font-size)`};
    line-height: ${`var(--eds-typography-${$type}-${$size}-lineheight-${$lineHeight})`};
    font-weight: ${`var(--eds-typography-${$type}-${$size}-font-weight-${$fontWeight})`};
    letter-spacing: ${`var(--eds-typography-${$type}-${$size}-tracking-${$letterSpacing})`};
    color: var(--text-override-color, var(--_text-preset-color, inherit));
    --_offset: calc(${$offset} * 1em);
    --_grid-base: 4px;
    &[href],
    & [href] {
      color: var(--custom-color-link, light-dark(#034187, #90d6fc));
    }

    @supports (height: round(up, 10px, 1px)) {
      /*This calculates the rest-values to make the total height a multiple of 4px.
      When onGrid is true, the rest is only added to the top of the text-box.*/
      --_rest-top: ${$onGrid
        ? 'calc(round(nearest, 1cap, var(--_grid-base)) - 1cap)'
        : 'calc((round(nearest, 1cap, var(--_grid-base)) - 1cap) / 2)'};
      --_rest-bottom: ${$onGrid
        ? '0cap'
        : 'calc((round(nearest, 1cap, var(--_grid-base)) - 1cap) / 2)'};
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
