import React, { useState } from 'react'
import { Tabs2 } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'

const { Tab } = Tabs2

export default {
  title: 'Components|Tabs2',
  component: Tabs2,
}

const Wrapper = styled.div`
  background: silver;
`

const Panel = ({ children, label, activeTab }) =>
  activeTab === label && (
    <div style={{ background: 'lime', paddingTop: '20px' }}>{children}</div>
  )

export const allTabs = ({ variant }) => {
  const [activeTab, setActiveTab] = useState('1')
  return (
    <Wrapper>
      <Tabs2>
        <Tab
          label="1"
          activeTab={activeTab}
          onClick={() => {
            console.log('clicked button 1')
            setActiveTab('1')
          }}
        >
          Tab 1
        </Tab>
        <Tab
          label="2"
          activeTab={activeTab}
          onClick={() => {
            console.log('clicked button 2')
            setActiveTab('2')
          }}
        >
          Tab 2
        </Tab>
        <Tab
          label="3"
          activeTab={activeTab}
          onClick={() => {
            console.log('clicked button 3')
            setActiveTab('3')
          }}
        >
          Tab 3
        </Tab>
      </Tabs2>

      <Panel label="1" activeTab={activeTab}>
        Panel 1
      </Panel>
      <Panel label="2" activeTab={activeTab}>
        Panel 2
      </Panel>
      <Panel label="3" activeTab={activeTab}>
        Panel 3
      </Panel>
    </Wrapper>
  )
}
