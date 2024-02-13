/**
 * Function returning wether a string only contains number. Allows leading or trailing spaces.
 *
 * Examples:
 *
 * ```
 * isNumberOnlyString("10") // true
 * isNumberOnlyString("10.10") // true
 * isNumberOnlyString("10px") // false
 * isNumberOnlyString("10%") // false
 * isNumberOnlyString("10 ") // true
 * ```
 *
 * @param number
 * @returns
 */
export function isNumberOnlyString(number: string) {
  return !isNaN(Number(number)) && !isNaN(parseFloat(number))
}

export function addPxSuffixIfInputHasNoPrefix(size: number | string) {
  if (typeof size === 'number' || isNumberOnlyString(size)) {
    return `${size}px`
  }

  return size
}
