import { Icon as IconComponent } from './Icon'
import { add } from './library'

/**
 * @type {typeof import('./types').Icon}
 */
// @ts-ignore
const Icon = IconComponent

Icon.add = add

export { Icon }
