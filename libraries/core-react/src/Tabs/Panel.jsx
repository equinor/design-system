import React from 'react'
import { TabsContext } from './Tabs'

const Panel = ({ children, label }) => {
  const { activeTab } = React.useContext(TabsContext)
  return activeTab === label ? <div>{children}</div> : null
}

Panel.displayName = 'eds-panel'

export { Panel }
