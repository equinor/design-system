import React from 'react'
import styled from 'styled-components'

export const TabsContext = React.createContext(undefined)

const TabsBase = styled.div`
  background: lime;
`

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState('1')

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <TabsBase>{children}</TabsBase>
    </TabsContext.Provider>
  )
}

Tabs.displayName = 'eds-tabs'

export { Tabs }
