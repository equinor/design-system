import { List as BaseComponent } from './List'
import { ListItem } from './ListItem'

type ListTypes = typeof BaseComponent & {
  ListItem: typeof ListItem
}

const List = BaseComponent as ListTypes

List.ListItem = ListItem

export { List }
