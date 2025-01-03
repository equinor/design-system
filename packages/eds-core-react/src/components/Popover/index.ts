'use client'
import { Popover as BaseComponent, PopoverProps } from './Popover'
import { PopoverTitle, PopoverTitleProps } from './PopoverTitle'
import { PopoverContent, PopoverContentProps } from './PopoverContent'
import { PopoverHeader, PopoverHeaderProps } from './PopoverHeader'
import { PopoverActions, PopoverActionsProps } from './PopoverActions'

type PopoverConformProps = typeof BaseComponent & {
  Title: typeof PopoverTitle
  Content: typeof PopoverContent
  Header: typeof PopoverHeader
  Actions: typeof PopoverActions
}

const Popover = BaseComponent as PopoverConformProps
Popover.Title = PopoverTitle
Popover.Content = PopoverContent
Popover.Header = PopoverHeader
Popover.Actions = PopoverActions

Popover.Title.displayName = 'Popover.Title'
Popover.Content.displayName = 'Popover.Content'
Popover.Header.displayName = 'Popover.Header'
Popover.Actions.displayName = 'Popover.Actions'

export { Popover }
export type {
  PopoverProps,
  PopoverContentProps,
  PopoverTitleProps,
  PopoverHeaderProps,
  PopoverActionsProps,
}
