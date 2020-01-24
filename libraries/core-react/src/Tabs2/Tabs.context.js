import React, { createContext } from 'react'

export const TabsContext = createContext({
  variant: 'minWidth',
  changeHandler: () => {},
  activeIndex: 0,
})

export const TabsProvider = TabsContext.Provider
export const TabsConsumer = TabsContext.Consumer
