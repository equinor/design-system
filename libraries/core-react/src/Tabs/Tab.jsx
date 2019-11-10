import React from 'react'
import styled from 'styled-components'

const TabBase = styled.div`
  background: orange;
  flex: 0 0 100px;
  text-align: center;
`

const Tab = ({ children }) => <TabBase>{children}</TabBase>

Tab.displayName = 'eds-tab'

export { Tab }
