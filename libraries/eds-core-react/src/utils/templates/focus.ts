import { css } from 'styled-components'

import { Outline, tokens } from '@equinor/eds-tokens'
import { shorthand, StyledCSS } from './common'

const {
  colors: {
    interactive: {
      focus: { rgba: focusColor },
    },
  },
} = tokens

export const outlineTemplate = (outline: Outline): StyledCSS => {
  const {
    color = focusColor,
    style = 'dashed',
    width = '1px',
    offset = '2px',
    type,
  } = outline

  const outline_: Outline = {
    color,
    style,
    width,
    offset,
    type,
  }
  return css({
    outline: shorthand(outline_),
    outlineOffset: outline_.offset,
  })
}
