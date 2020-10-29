import { Popover as BaseComponent, PopoverProps as Props } from './Popover'
import { PopoverTitle } from './PopoverTitle'
import { PopoverAnchor } from './PopoverAnchor'
import { PopoverContent } from './PopoverContent'
import { PopoverItem } from './PopoverItem'

type PopoverTypes = typeof BaseComponent & {
  PopoverTitle: typeof PopoverTitle
  PopoverAnchor: typeof PopoverAnchor
  PopoverContent: typeof PopoverContent
  PopoverItem: typeof PopoverItem
}

const Popover = BaseComponent as PopoverTypes

Popover.PopoverTitle = PopoverTitle
Popover.PopoverAnchor = PopoverAnchor
Popover.PopoverContent = PopoverContent
Popover.PopoverItem = PopoverItem

export { Popover }
export type PopoverProps = Props
