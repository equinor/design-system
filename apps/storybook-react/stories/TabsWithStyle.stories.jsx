import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { withKnobs, select, text } from '@storybook/addon-knobs'

const TopBarDiv = styled.div.attrs({ role: 'tabpanel' })``

const Ul = styled.ul.attrs({
  role: 'tablist',
})`
  list-style-type: none;
  padding-left: 0;
  display: flex;
`

const Li = styled.li.attrs({ role: 'presentation' })``

const Button = styled.button.attrs({ role: 'tab' })``

const PanelDiv = styled.div.attrs({ role: 'tabpanel' })``

const TopBar = ({ children }) => <div>{children}</div>
const Tabs = ({ children }) => <Ul>{children}</Ul>
const Tab = ({ label, selected }) => (
  <Li>
    <Button selected={{ selected }}>{label}</Button>
  </Li>
)

const Panel = ({ children }) => <PanelDiv>{children}</PanelDiv>

export default {
  title: 'Components|TabsWithStyle',
  component: Tabs,
}

const Wrapper = styled.div`
  background: silver;
`

export const allTabs = () => (
  <Wrapper>
    <TopBar>
      <Tabs>
        <Tab label="Tab 1" selected />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>
    </TopBar>
    <Panel>
      <Typography variant="body_short">Some panel</Typography>
    </Panel>
  </Wrapper>
)
