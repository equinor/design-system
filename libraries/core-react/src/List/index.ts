import { List as BaseComponent, ListProps } from './List'
import { ListItem } from './ListItem'

type ListCompoundProps = typeof BaseComponent & {
  ListItem: typeof ListItem
}

const List = BaseComponent as ListCompoundProps

List.ListItem = ListItem

export { List }
export type { ListProps }
