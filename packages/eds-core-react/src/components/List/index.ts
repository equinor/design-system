'use client'
import { List as BaseComponent, ListProps } from './List'
import { ListItem, ListItemProps } from './ListItem'

type ListCompoundProps = typeof BaseComponent & {
  Item: typeof ListItem
}

const List = BaseComponent as ListCompoundProps
List.Item = ListItem

List.Item.displayName = 'List.Item'

export { List }
export type { ListProps, ListItemProps }
