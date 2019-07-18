import * as R from 'ramda'

const defaultToEmpty = R.defaultTo('')
const unitProcessor = (val, unit) => {
  const number = defaultToEmpty(val)
  return R.isEmpty(number) ? number : `${number}${unit}`
}

export const rootFontSize = 16
export const px = (val) => unitProcessor(val, 'px')
export const em = (val) => unitProcessor(val, 'em')
export const rem = (val) => unitProcessor(val, 'rem')
