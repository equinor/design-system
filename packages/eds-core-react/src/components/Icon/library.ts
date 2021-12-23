import type { IconData } from '@equinor/eds-icons'
import type { IconBasket, Name } from './Icon.types'

type IconRecord = Record<Name, IconData>

let _icons: IconRecord = {}
let count = 0
/** Add icons to library to be used for rendering using name.
This needs to be done lonly once */
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
