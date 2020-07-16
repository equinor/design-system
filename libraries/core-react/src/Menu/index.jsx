import React from 'react'
import { Menu as BaseMenu } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'
import { MenuProvider } from './Menu.context'

const Menu = ({ children, ...rest }) => (
  <MenuProvider>
    <BaseMenu {...rest}>{children}</BaseMenu>
  </MenuProvider>
)

Menu.MenuItem = MenuItem
Menu.MenuSection = MenuSection

Menu.propTypes = BaseMenu.propTypes
Menu.defaultProps = BaseMenu.defaultProps
Menu.displayName = BaseMenu.displayName

export { Menu }
