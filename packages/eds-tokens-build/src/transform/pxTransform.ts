/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Transform } from 'style-dictionary/types'
import { toFixedWithoutTrailingZeroes } from '../utils'

export const PX_TRANSFORM_NAME = 'eds/css/px'

export const pxTransform: Transform = {
  type: 'value',
  transitive: false,
  name: PX_TRANSFORM_NAME,
  filter: (token) => {
    const isDefined = token?.$value !== undefined
    if (!isDefined) return false

    const isNumber = token.$type === 'number'
    return isNumber
  },
  transform: (token) => {
    const fixedValue = toFixedWithoutTrailingZeroes(Number(token.$value))
    return `${fixedValue}px`
  },
}
