// @ts-nocheck
import React, { createContext } from 'react'

const TabsContext = createContext({
  variant: '',
  handleChange: () => {},
  activeTab: 0,
  tabsId: '',
  tabsFocused: false,
})

const TabsProvider = TabsContext.Provider
const TabsConsumer = TabsContext.Consumer

export { TabsContext, TabsProvider, TabsConsumer }
