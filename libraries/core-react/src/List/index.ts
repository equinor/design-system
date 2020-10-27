import { List as BaseComponent } from './List'
import { ListItem } from './ListItem'

type ListProps = typeof BaseComponent & {
  ListItem: typeof ListItem
}

const List = BaseComponent as ListProps

List.ListItem = ListItem

export { List, ListProps }
