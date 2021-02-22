import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle } from './PopoverTitle'
import { PopoverContent } from './PopoverContent'

type PopoverConformProps = typeof BaseComponent & {
  // Deprecated
  PopoverTitle: typeof PopoverTitle
  PopoverContent: typeof PopoverContent
  // New
  Title: typeof PopoverTitle
  Content: typeof PopoverContent
}

const Popover = BaseComponent as PopoverConformProps
// Deprecated
Popover.PopoverTitle = PopoverTitle
Popover.PopoverContent = PopoverContent
// New
Popover.Title = PopoverTitle
Popover.Content = PopoverContent

export { Popover }
export type { PopoverProps }
