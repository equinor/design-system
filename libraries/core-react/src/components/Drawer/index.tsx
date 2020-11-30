import * as React from 'react'
import { FC } from 'react'
import { Drawer as BaseComponent, DrawerProps as Props } from './Drawer'
import { DrawerContainer } from './DrawerContainer'
import { DrawerList } from './DrawerList'
import { DrawerItem } from './DrawerItem'
import { DrawerSubtitle } from './DrawerSubtitle'
import { DrawerLabel } from './DrawerLabel'
import { DrawerProvider } from './Drawer.context'

type DrawerProps = typeof BaseComponent & {
  DrawerContainer: typeof DrawerContainer
  DrawerList: typeof DrawerList
  DrawerItem: typeof DrawerItem
  DrawerSubtitle: typeof DrawerSubtitle
  DrawerLabel: typeof DrawerLabel
}

const DrawerWrapper: FC<Props> = ({ children, ...rest }) => (
  <DrawerProvider>
    <BaseComponent {...rest}>{children}</BaseComponent>
  </DrawerProvider>
)

const Drawer = DrawerWrapper as DrawerProps

Drawer.DrawerContainer = DrawerContainer
Drawer.DrawerList = DrawerList
Drawer.DrawerItem = DrawerItem
Drawer.DrawerSubtitle = DrawerSubtitle
Drawer.DrawerLabel = DrawerLabel

export { Drawer, DrawerProps }
