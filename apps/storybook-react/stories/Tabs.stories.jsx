import React from 'react'
import { Tabs, Tab } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'

export default {
  title: 'Components|Tabs',
  component: Tab,
}

const Wrapper = styled.div`
  background: deeppink;
`

export const allTabs = () => (
  <Wrapper>
    <Tabs>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    </Tabs>
  </Wrapper>
)
