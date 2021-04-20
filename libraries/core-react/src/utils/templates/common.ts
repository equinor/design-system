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
  const { width = '', style = '', color = '' } = token

  if (!width && !style && !color) {
    return null
  }

  return `${width} ${style} ${color}`
}
