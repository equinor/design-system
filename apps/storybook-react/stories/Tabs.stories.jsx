import React, { useContext, useState } from 'react'
import { Tabs } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'

const { Tab, Panel } = Tabs

export default {
  title: 'Components|Tabs',
  component: Tabs,
}

const Wrapper = styled.div`
  background: silver;
`

export const allTabs = ({ variant }) => {
  return (
    <Wrapper>
      <Tabs>
        <Tab label="1">Tab 1</Tab>
        <Tab label="2">Tab 2</Tab>
        <Tab label="3">Tab 3</Tab>

        <Panel label="1">
          <p>Panel 1</p>
        </Panel>
        <Panel label="2">
          <p>Panel 2</p>
        </Panel>
        <Panel label="3">
          <p>Panel 3</p>
        </Panel>
      </Tabs>
    </Wrapper>
  )
}
