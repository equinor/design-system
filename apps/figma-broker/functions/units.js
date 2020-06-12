import * as R from 'ramda'

const defaultToEmpty = R.defaultTo('')
const unitProcessor = (val, unit) => {
  const number = defaultToEmpty(val)

  if (R.isEmpty(number) || number === 0) {
    return number
  }

  return `${number}${unit}`
}

export const rootFontSize = 16
export const px = (val) => unitProcessor(val, 'px')
export const em = (val) => unitProcessor(val, 'em')
export const rem = (val) => unitProcessor(val, 'rem')
