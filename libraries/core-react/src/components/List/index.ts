import { List as BaseComponent, ListProps } from './List'
import { ListItem, ListItemProps } from './ListItem'

type ListCompoundProps = typeof BaseComponent & {
  // Deprectated
  ListItem: typeof ListItem
  // New
  Item: typeof ListItem
}

const List = BaseComponent as ListCompoundProps
// Deprecated
List.ListItem = ListItem
// New
List.Item = ListItem

List.Item.displayName = 'List.Item'

export { List }
export type { ListProps, ListItemProps }
