import { Icon as IconComponent } from './Icon'
import { add } from './library'
import type { IconType } from './Icon.types'

const Icon = IconComponent as IconType

Icon.add = add

export { Icon }
