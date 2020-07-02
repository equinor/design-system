import React from 'react'
import { useMenus, Link } from 'docz'

export const Menu = () => {
  const menus = useMenus()
  return (
    <ul>
      {menus.map((menu) => (
        <li key={menu.id}>
          <Link to={menu.route}>{menu.name}</Link>
        </li>
      ))}
    </ul>
  )
}
