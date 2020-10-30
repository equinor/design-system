import { Popover as BaseComponent } from './Popover'
import { PopoverTitle } from './PopoverTitle'
import { PopoverAnchor } from './PopoverAnchor'
import { PopoverContent } from './PopoverContent'

type PopoverProps = typeof BaseComponent & {
  PopoverTitle: typeof PopoverTitle
  PopoverAnchor: typeof PopoverAnchor
  PopoverContent: typeof PopoverContent
}

const Popover = BaseComponent as PopoverProps

Popover.PopoverTitle = PopoverTitle
Popover.PopoverAnchor = PopoverAnchor
Popover.PopoverContent = PopoverContent

export { Popover, PopoverProps }
