// eslint-disable-next-line import/no-named-as-default
import { HTMLAttributes, AnchorHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $offset?: number
  $onGrid?: boolean
  $color?: string
} & (HTMLAttributes<HTMLElement> | AnchorHTMLAttributes<HTMLAnchorElement>)

export const Typography = styled.p<StyleHeadingProps>`
  font-weight: 400; //font weight will be provided via token probably
  margin: 0;
  ${({
    $fontFamily,
    $fontSize,
    $lineHeight,
    $offset = 0,
    $onGrid = true,
    $color,
  }) => css`
    //populate old token fallbacks with new tokens? but these new components will REQUIRE new tokens no? so maybe this is pointless
    --eds_text_static_icons__default: var(--eds-color-text-primary);
    --eds_text_static_icons__secondary: var(--eds-color-text-secondary);
    --eds_text_static_icons__tertiary: var(--eds-color-text-tertiary);

    --_text-preset-color: ${$color};
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
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
        ? 'calc(round(up, 1cap, var(--_grid-base)) - 1cap)'
        : 'calc((round(up, 1cap, var(--_grid-base)) - 1cap) / 2)'};
      --_rest-bottom: ${$onGrid
        ? '0cap'
        : 'calc((round(up, 1cap, var(--_grid-base)) - 1cap) / 2)'};
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
