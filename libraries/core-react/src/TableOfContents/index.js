import { TableOfContents as TableOfContentsComponent } from './TableOfContents'
import { LinkItem } from './LinkItem'

/**
 * @type {typeof import('./types').TableOfContents}
 */
// @ts-ignore
const TableOfContents = TableOfContentsComponent

TableOfContents.LinkItem = LinkItem

export { TableOfContents }
