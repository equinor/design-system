import { createContext } from 'react'
import { Variants } from './Tabs.types'

type State = {
  variant: Variants
  scrollable: boolean
  handleChange: (value: number | string) => void
  activeTab: number | string
  tabsId: string
  tabsFocused: boolean
}

const TabsContext = createContext<State>({
  variant: 'minWidth',
  scrollable: false,
  handleChange: () => null,
  activeTab: 0,
  tabsId: '',
  tabsFocused: false,
})

const TabsProvider = TabsContext.Provider
const TabsConsumer = TabsContext.Consumer

export { TabsContext, TabsProvider, TabsConsumer }
