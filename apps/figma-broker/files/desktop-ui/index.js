import { fixPageName } from '@utils'
import { makeButtonsComponent } from './buttons'
import { makeTablesComponent } from './table'
import { makeTextfieldsComponent } from './textfields'

export const makeDesktopComponents = (figmaFile) => {
  const components = []
  const { pages, getStyle } = figmaFile

  pages.forEach((page) => {
    const fixedPageName = fixPageName(page.name)
    const data = page.children

    switch (fixedPageName) {
      case 'buttons primary color':
        components.push({
          name: 'buttons-primary',
          value: makeButtonsComponent(data, getStyle),
          path: 'button',
        })
        break
      case 'buttons secondary color':
        components.push({
          name: 'buttons-secondary',
          value: makeButtonsComponent(data, getStyle),
          path: 'button',
        })
        break
      case 'buttons danger color':
        components.push({
          name: 'buttons-danger',
          value: makeButtonsComponent(data, getStyle),
          path: 'button',
        })
        break
      case 'buttons disabled':
        components.push({
          name: 'buttons-disabled',
          value: makeButtonsComponent(data, getStyle),
          path: 'button',
        })
        break
      case 'table':
        components.push({
          name: 'table',
          value: makeTablesComponent(data, getStyle),
          path: 'table',
        })
        break
        // case 'text fields':
        //   components.push({
        //     name: 'text-fields',
        //     value: makeTextfieldsComponent(data, getStyle),
        //     path: 'text-fields',
        //   })
        break
      default:
        break
    }
  })

  return components
}
