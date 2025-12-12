/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Transform } from 'style-dictionary/types'
import { transformNumberToRem } from '../utils'

export const PX_TO_REM_NAME = 'eds/css/pxToRem'

export const pxToRem: Transform = {
  type: `value`,
  transitive: true,
  name: PX_TO_REM_NAME,
  filter: (token) => {
    if (
      token?.$value === undefined ||
      token.$type !== 'number' ||
      isNaN(Number(token.$value))
    ) {
      return false
    }

    // Skip if value is already transformed (string with unit)
    if (typeof token.$value === 'string') {
      return false
    }

    // Skip icon container padding tokens - they should use em instead of rem
    const path = token?.path ?? []
    const isSizingIconPath = path[0] === 'sizing' && path[1] === 'icon'
    const hasContainerPadding = path.some(
      (segment) =>
        typeof segment === 'string' && segment.includes('container-padding'),
    )
    if (isSizingIconPath && hasContainerPadding) {
      return false
    }

    const matchingPathSegments = [
      'font',
      'size',
      'line-height',
      'font-size',
      'sizing',
      'spacing',
    ]

    const isMatch =
      token?.path?.length > 0 &&
      matchingPathSegments.some((segment) => token.path.includes(segment))

    return isMatch
  },
  transform: (token) => {
    return transformNumberToRem(Number(token.$value))
  },
}
