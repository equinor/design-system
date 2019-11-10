import React from 'react'
import styled from 'styled-components'

const TabsBase = styled.div`
  background: lime;
  display: flex;
`

const Tabs = ({ children }) => <TabsBase>{children}</TabsBase>

Tabs.displayName = 'eds-tabs'

export { Tabs }
