import { Drawer as BaseComponent } from './Drawer'
import { DrawerContainer } from './DrawerContainer'
import { DrawerList } from './DrawerList'
import { DrawerItem } from './DrawerItem'
import { DrawerSubtitle } from './DrawerSubtitle'
import { DrawerLabel } from './DrawerLabel'

type DrawerProps = typeof BaseComponent & {
  DrawerContainer: typeof DrawerContainer
  DrawerList: typeof DrawerList
  DrawerItem: typeof DrawerItem
  DrawerSubtitle: typeof DrawerSubtitle
  DrawerLabel: typeof DrawerLabel
}

const Drawer = BaseComponent as DrawerProps

Drawer.DrawerContainer = DrawerContainer
Drawer.DrawerList = DrawerList
Drawer.DrawerItem = DrawerItem
Drawer.DrawerSubtitle = DrawerSubtitle
Drawer.DrawerLabel = DrawerLabel

export { Drawer, DrawerProps }
