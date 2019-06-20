import { fixPageName } from '@utils'
import { makeButtonsComponent } from './buttons'

export const makeDesktopComponents = (figmaPages) => {
  const components = []

  figmaPages.forEach((page) => {
    const fixedPageName = fixPageName(page.name)
    const data = page.children

    switch (fixedPageName) {
      case 'buttons primary color':
        components.push({
          name: 'buttons-primary',
          value: makeButtonsComponent(data),
        })
      default:
        break
    }
  })

  return components
}
