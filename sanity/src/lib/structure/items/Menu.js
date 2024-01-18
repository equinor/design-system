import { MenuIcon } from '../../../../icons'
import { languages } from '../../../../languages'
// eslint-disable-next-line import/no-unresolved
import flags from '../../../../icons/countries'
import { Flags } from '../../datasetHelpers'

const menuId = (lang) => {
  if (Flags.HAS_FANCY_MENU) {
    return lang.id + '-menu'
  } else {
    return lang.id + '-simple-menu'
  }
}

const getMenuListItems = (S, lang) => {
  const mainMenu = S.listItem({
    title: 'Main menu',
    id: `main-menu`,
    icon: MenuIcon,
    child: () =>
      S.documentWithInitialValueTemplate(Flags.HAS_FANCY_MENU ? 'menu-with-locale' : 'simple-menu-with-locale', {
        isoCode: `${lang.name}`,
      })
        .id(menuId(lang))
        .title(`${lang.title} site menu`),
  })

  const subMenu = S.listItem({
    title: 'Sub menus',
    id: 'subMenuTest',
    child: () =>
      S.documentTypeList('subMenu')
        .title('Sub menu')
        .filter('_type == "subMenu" && _lang == $baseLang')
        .params({ baseLang: lang.name })
        .initialValueTemplates([S.initialValueTemplateItem('submenu-with-locale', { isoCode: `${lang.name}` })]),
  })

  return Flags.HAS_FANCY_MENU ? [mainMenu, subMenu] : [mainMenu]
}

const menus = (S) =>
  languages.map((lang) =>
    S.listItem({
      title: `${lang.title} menu`,
      id: `menu-${lang.id}`,
      icon: flags[lang.id],
      child: () =>
        S.list({
          id: 'menu-list',
          items: getMenuListItems(S, lang),
        }),
    }),
  )

export const Menu = (S) =>
  S.listItem()
    .title('Menu')
    .icon(MenuIcon)
    .child(S.list('menu').id('menu').title('Menus').items(menus(S)))
