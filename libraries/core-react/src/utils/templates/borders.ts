import { css } from 'styled-components'
import type { FlattenSimpleInterpolation } from 'styled-components'
import type { Border, Borders, Outline } from '@equinor/eds-tokens'

type StyledCSS = FlattenSimpleInterpolation

const shorthand = (border: Border | Outline): string => {
  if (!border) {
    return undefined
  }
  const { width = '', style = 'solid', color = '' } = border

  return `${width} ${style} ${color}`
}

export const bordersTemplate = (border: Borders): StyledCSS => {
  switch (border.type) {
    case 'border':
      return css({
        border: shorthand(border),
        borderRadius: border.radius,
      })
    case 'outline':
      return css({
        outline: shorthand(border),
        outlineOffset: border.offset,
      })
    case 'bordergroup':
      const leftRadius = border?.left?.radius
      const rightRadius = border?.right?.radius
      return css({
        borderBottom: shorthand(border.bottom),
        borderTop: shorthand(border.top),
        borderLeft: shorthand(border.left),
        borderRight: shorthand(border.right),
        borderBottomLeftRadius: leftRadius,
        borderTopLeftRadius: leftRadius,
        borderBottomRightRadius: rightRadius,
        borderTopRightRadius: rightRadius,
      })
    default:
      return css({})
  }
}
