import React from 'react'
import styled from 'styled-components'

const TabsBase = styled.div`
  background: lime;
`

const Tabs = ({ children, ...props }) => (
  <TabsBase {...props}>{children}</TabsBase>
)

Tabs.displayName = 'eds-tabs'

export { Tabs }
