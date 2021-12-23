import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle, PopoverTitleProps } from './PopoverTitle'
import { PopoverContent, PopoverContentProps } from './PopoverContent'

type PopoverConformProps = typeof BaseComponent & {
  Title: typeof PopoverTitle
  Content: typeof PopoverContent
}

const Popover = BaseComponent as PopoverConformProps
Popover.Title = PopoverTitle
Popover.Content = PopoverContent

Popover.Title.displayName = 'Popover.Title'
Popover.Content.displayName = 'Popover.Content'

export { Popover }
export type { PopoverProps, PopoverContentProps, PopoverTitleProps }
