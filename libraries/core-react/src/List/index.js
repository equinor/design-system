import { List as ListComponent } from './List'
import { ListItem } from './ListItem'

/**
 * @type {typeof import('./types').List}
 */
// @ts-ignore
const List = ListComponent

List.ListItem = ListItem

export { List }
