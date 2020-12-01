import * as React from 'react'
import { FC } from 'react'
import { Drawer as BaseComponent, DrawerProps as Props } from './Drawer'
import { DrawerList } from './DrawerList'
import { DrawerItem } from './DrawerItem'
import { DrawerLabel } from './DrawerLabel'
import { DrawerProvider } from './Drawer.context'

type DrawerProps = typeof BaseComponent & {
  DrawerList: typeof DrawerList
  DrawerItem: typeof DrawerItem
  DrawerLabel: typeof DrawerLabel
}

const DrawerWrapper: FC<Props> = ({ children, ...rest }) => (
  <DrawerProvider>
    <BaseComponent {...rest}>{children}</BaseComponent>
  </DrawerProvider>
)

const Drawer = DrawerWrapper as DrawerProps

Drawer.DrawerList = DrawerList
Drawer.DrawerItem = DrawerItem
Drawer.DrawerLabel = DrawerLabel

export { Drawer, DrawerProps }
