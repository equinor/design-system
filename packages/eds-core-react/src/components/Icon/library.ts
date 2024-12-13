import type { IconData } from '@equinor/eds-icons'
import type { Name } from './Icon.types'

type IconRecord = Record<Name, IconData>

let _icons: IconRecord = {}
/** Add icons to library to be used for rendering using name.
This needs to be done lonly once */
export const add = (icons: IconRecord): void => {
  _icons = {
    ..._icons,
    ...icons,
  }
}

export const get = (name: Name): IconData | undefined => {
  return _icons[name]
}
