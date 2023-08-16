import type { IconData, IconName } from '@equinor/eds-icons'
import { Icon } from './Icon'
import { add } from './library'

export type IconBasket = { icon?: IconData; count: number }

export type Name = IconName

export type IconType = typeof Icon & {
  add: typeof add
}
