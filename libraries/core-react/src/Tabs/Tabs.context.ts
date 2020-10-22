import { createContext } from 'react'
import { Variants } from './Tabs.types'

type State = {
  variant: Variants
  handleChange: (index: number) => void
  activeTab: number
  tabsId: string
  tabsFocused: boolean
}

const TabsContext = createContext<State>({
  variant: 'minWidth',
  handleChange: () => null,
  activeTab: 0,
  tabsId: '',
  tabsFocused: false,
})

const TabsProvider = TabsContext.Provider
const TabsConsumer = TabsContext.Consumer

export { TabsContext, TabsProvider, TabsConsumer }
