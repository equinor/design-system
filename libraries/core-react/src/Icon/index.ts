import { Icon as IconComponent } from './Icon'
import { add } from './library'
import type { IconProps } from './Icon.types'

const Icon = IconComponent as IconProps

Icon.add = add

export { Icon }
export type { IconProps }
