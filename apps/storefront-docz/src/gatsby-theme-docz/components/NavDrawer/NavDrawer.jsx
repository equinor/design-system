import React from 'react'
import { useDocs, useConfig, useCurrentDoc } from 'docz'
import { Link } from 'gatsby'

const NavDrawer = () => {
  const docs = useDocs()

  const current = useCurrentDoc()

  console.log('current', current)

  const { menu } = useConfig()

  const firstRouteSegment = /^\/[a-z-]+\//

  const notRootRoute = (doc) => doc.route.length > 1

  const routesWithTwoSegments = (doc) =>
    doc.route.replace(/^\/|\/$/g, '').split('/').length < 3

  const subMenus = docs
    .filter(notRootRoute)
    .filter(routesWithTwoSegments)
    .map((doc) => ({
      title: doc.title,
      route: doc.route,
      current: current.route.includes(doc.route),
    }))

  subMenus.forEach((subMenuItem) => {
    const category = menu.find(
      (menuItem) =>
        menuItem.route === subMenuItem.route.match(firstRouteSegment)?.[0],
    )
    if (category) {
      category.children.push(subMenuItem)
      return
    }
    console.error(
      `Document ${subMenuItem.title} is missing a proper route declaration, and will not be added in the menu`,
    )
  })

  return (
    <ul>
      {menu.map((menuItem) => (
        <li key={menuItem.route}>
          {menuItem.title}
          <ul>
            {menuItem.children.map((subMenuItem) => (
              <li key={subMenuItem.route}>
                <Link
                  to={subMenuItem.route}
                  style={
                    subMenuItem.current
                      ? { fontWeight: 'bold' }
                      : { fontWeight: 'normal' }
                  }
                >
                  {subMenuItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export { NavDrawer }
