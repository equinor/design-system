import { css } from 'styled-components'

import type { Borders } from '@equinor/eds-tokens'
import { shorthand, StyledCSS } from './common'

export const bordersTemplate = (border: Borders): StyledCSS => {
  switch (border.type) {
    case 'border':
      return css({
        border: shorthand(border),
        borderRadius: border.radius,
      })
    case 'bordergroup':
      return css({
        borderBottom: shorthand(border.bottom),
        borderTop: shorthand(border.top),
        borderLeft: shorthand(border.left),
        borderRight: shorthand(border.right),
        borderBottomLeftRadius: border?.left?.radius,
        borderTopLeftRadius: border?.left?.radius,
        borderBottomRightRadius: border?.right?.radius,
        borderTopRightRadius: border?.right?.radius,
      })
    default:
      return css({})
  }
}
