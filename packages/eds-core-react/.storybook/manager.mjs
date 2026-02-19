import {
  addons,
  types,
  useGlobals,
  useStorybookState,
} from 'storybook/manager-api'
import { createElement } from 'react'
import { IconButton } from 'storybook/internal/components'

import { theme } from './theme.mjs'

const ADDON_ID = 'eds-color-scheme-toggle'

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    type: types.TOOL,
    title: 'Color Scheme',
    render: () => {
      const [globals, updateGlobals] = useGlobals()
      const state = useStorybookState()
      const story = state.index?.[state.storyId]
      const isNext = story?.title?.startsWith('EDS 2.0')

      if (!isNext) return null

      const isDark = globals.colorScheme === 'dark'

      return createElement(
        IconButton,
        {
          key: ADDON_ID,
          title: isDark ? 'Switch to light mode' : 'Switch to dark mode',
          onClick: () =>
            updateGlobals({
              colorScheme: isDark ? 'light' : 'dark',
            }),
        },
        isDark ? '☾ Dark mode' : '☼ Light mode',
      )
    },
  })
})

addons.setConfig({
  theme,
})
