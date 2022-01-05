import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle, PopoverTitleProps } from './PopoverTitle'
import { PopoverContent, PopoverContentProps } from './PopoverContent'
import { PopoverHeader, PopoverHeaderProps } from './PopoverHeader'

type PopoverConformProps = typeof BaseComponent & {
  Title: typeof PopoverTitle
  Content: typeof PopoverContent
  Header: typeof PopoverHeader
}

const Popover = BaseComponent as PopoverConformProps
Popover.Title = PopoverTitle
Popover.Content = PopoverContent
Popover.Header = PopoverHeader

Popover.Title.displayName = 'Popover.Title'
Popover.Content.displayName = 'Popover.Content'
Popover.Header.displayName = 'Popover.header'

export { Popover }
export type {
  PopoverProps,
  PopoverContentProps,
  PopoverTitleProps,
  PopoverHeaderProps,
}
