import React, { createContext } from 'react'

const TabsContext = createContext({
  variant: '',
  /** @param {number} index */
  handleChange: (index) => {},
  activeTab: 0,
  tabsId: '',
})

const TabsProvider = TabsContext.Provider
const TabsConsumer = TabsContext.Consumer

export { TabsContext, TabsProvider, TabsConsumer }
