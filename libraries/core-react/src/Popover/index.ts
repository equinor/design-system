import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle } from './PopoverTitle'
import { PopoverAnchor } from './PopoverAnchor'
import { PopoverContent } from './PopoverContent'

type PopoverConformProps = typeof BaseComponent & {
  PopoverTitle: typeof PopoverTitle
  PopoverAnchor: typeof PopoverAnchor
  PopoverContent: typeof PopoverContent
}

const Popover = BaseComponent as PopoverConformProps

Popover.PopoverTitle = PopoverTitle
Popover.PopoverAnchor = PopoverAnchor
Popover.PopoverContent = PopoverContent

export { Popover }
export type { PopoverProps }
