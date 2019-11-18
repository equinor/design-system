import React from 'react'
import styled from 'styled-components'
import { TabsContext } from './Tabs'

const TabBase = styled.button`
  background: ${({ active }) => (active ? 'orange' : 'yellow')};
  text-align: center;
`

const Tab = ({ children, label, clickHandler }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  return (
    <TabBase
      active={label === activeTab}
      label={label}
      onClick={() => {
        setActiveTab(label)
      }}
    >
      {children}
    </TabBase>
  )
}

Tab.displayName = 'eds-tab'

export { Tab }
