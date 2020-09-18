import type { IconData } from '@equinor/eds-icons'
import type { IconBasket, Name } from './Icon.types'

type IconRecord = Record<Name, IconData>

let _icons: IconRecord = {}
let count = 0

export const add = (icons: IconRecord): void => {
  _icons = {
    ..._icons,
    ...icons,
  }
}

export const get = (name: Name): IconBasket => {
  count += 1
  return { icon: _icons[name], count }
}
