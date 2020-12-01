import type { FlattenSimpleInterpolation } from 'styled-components'

export type StyledCSS = FlattenSimpleInterpolation

type Shorthand = (token: {
  width?: string | number
  style?: string
  color?: string
}) => string

export const shorthand: Shorthand = (token) => {
  if (!token) {
    return undefined
  }
  const { width = '', style = 'solid', color = '' } = token

  return `${width} ${style} ${color}`
}
