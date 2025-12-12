import type { Transform } from 'style-dictionary/types'
import { toFixedWithoutTrailingZeroes } from '../utils'

export const ICON_CONTAINER_PADDING_TO_EM_NAME = 'eds/css/iconContainerPaddingToEm'

/**
 * Transform for icon container padding tokens.
 * Converts pixel values to em units using a placeholder calculation.
 *
 * TODO: Replace placeholder calculation with the actual formula.
 * Current placeholder: value / 16 (same as rem, but outputs em)
 *
 * The transform matches tokens with paths containing:
 * - 'sizing' > 'icon' > '*-container-padding-*'
 */
export const iconContainerPaddingToEm: Transform = {
    type: 'value',
    transitive: true,
    name: ICON_CONTAINER_PADDING_TO_EM_NAME,
    filter: (token) => {
        // Skip if value is already transformed (string with unit)
        const value = token?.$value
        if (typeof value === 'string') {
            return false
        }

        if (
            value === undefined ||
            token.$type !== 'number' ||
            isNaN(Number(value))
        ) {
            return false
        }

        // Match tokens by path structure: ['sizing', 'icon', '*-container-padding-*']
        const path = token?.path ?? []

        // Path should be ['sizing', 'icon', 'xs-container-padding-horisontal'] or similar
        if (path.length < 3) return false

        const isSizingPath = path[0] === 'sizing'
        const isIconPath = path[1] === 'icon'
        const hasContainerPadding = path.some(
            (segment) =>
                typeof segment === 'string' && segment.includes('container-padding'),
        )

        return isSizingPath && isIconPath && hasContainerPadding
    },
    transform: (token) => {
        const value = Number(token.$value)

        if (value === 0) return '0em'

        // TODO: Replace this placeholder calculation with actual formula
        // Current: simple px to em conversion (value / 16)
        // You may want to calculate based on icon size or other factors
        const baseSize = 16 // placeholder base size
        const emValue = value / baseSize
        const fixedValue = toFixedWithoutTrailingZeroes(emValue)

        return `${fixedValue}em`
    },
}
