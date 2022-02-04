import type { css } from 'styled-components'

export type StyledCSS = ReturnType<typeof css>

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

  if (!width) {
    return null
  }

  return `${width} ${style} ${color}`
}
