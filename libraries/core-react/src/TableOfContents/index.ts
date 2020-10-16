import { TableOfContents as BaseComponent } from './TableOfContents'
import { LinkItem } from './LinkItem'

type TableOfContentsTypes = typeof BaseComponent & {
  LinkItem: typeof LinkItem
}

const TableOfContents = BaseComponent as TableOfContentsTypes

TableOfContents.LinkItem = LinkItem

export { TableOfContents }
