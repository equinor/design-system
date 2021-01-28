import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle } from './PopoverTitle'
import { PopoverAnchor } from './PopoverAnchor'
import { PopoverContent } from './PopoverContent'

type PopoverConformProps = typeof BaseComponent & {
  // Deprecated
  PopoverTitle: typeof PopoverTitle
  PopoverAnchor: typeof PopoverAnchor
  PopoverContent: typeof PopoverContent
  // New
  Title: typeof PopoverTitle
  Anchor: typeof PopoverAnchor
  Content: typeof PopoverContent
}

const Popover = BaseComponent as PopoverConformProps
// Deprecated
Popover.PopoverTitle = PopoverTitle
Popover.PopoverAnchor = PopoverAnchor
Popover.PopoverContent = PopoverContent
// New
Popover.Title = PopoverTitle
Popover.Anchor = PopoverAnchor
Popover.Content = PopoverContent

export { Popover }
export type { PopoverProps }
