import React, { createContext } from 'react'

const TabsContext = createContext({
  variant: '',
  handleChange: () => {},
  activeTab: 0,
  tabsId: '',
})

const TabsProvider = TabsContext.Provider
const TabsConsumer = TabsContext.Consumer

export { TabsContext, TabsProvider, TabsConsumer }
