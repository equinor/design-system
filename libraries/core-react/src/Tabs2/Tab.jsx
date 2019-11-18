import React from 'react'
import styled from 'styled-components'

const TabBase = styled.button`
  background: ${({ activeTab, label }) =>
    activeTab === label ? 'orange' : 'yellow'};
  text-align: center;
`

const Tab = ({ children, ...props }) => {
  return <TabBase {...props}>{children}</TabBase>
}

Tab.displayName = 'eds-tab'

export { Tab }
