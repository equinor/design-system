/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Transform } from 'style-dictionary/types'
import { toFixedWithoutTrailingZeroes } from '../utils'

export const PX_FORMATTED_NAME = 'eds/css/pxFormatted'

export const pxFormatted: Transform = {
  type: 'value',
  transitive: false,
  name: PX_FORMATTED_NAME,
  filter: (token) => {
    const isDefined = token?.$value !== undefined
    if (!isDefined) return false

    const isNumber = token.$type === 'number'
    if (!isNumber) return false

    const pxMatchers = ['tracking-tight', 'tracking-normal', 'tracking-loose']
    return (
      token?.path?.length > 0 &&
      pxMatchers.some((metric) => token.path.includes(metric))
    )
  },
  transform: (token) => {
    const fixedValue = toFixedWithoutTrailingZeroes(Number(token.$value))
    return `${fixedValue}px`
  },
}
