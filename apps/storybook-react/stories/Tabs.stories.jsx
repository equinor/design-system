import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { typography } from '../../../libraries/tokens/base/typography'
import { typographyTemplate } from '../../../libraries/core-react/src/_common/templates'

const { TabList, TabPanels, Tab } = Tabs

export default {
  title: 'Components|Tabs',
  component: Tabs,
}

const Wrapper = styled.div`
  margin: 32px;
`

const Panel = styled.div`
  margin-top: 2rem;
`

export const allTabs = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const tabChange = (index) => setTabIndex(index)

  return (
    <Wrapper>
      <Typography variant="h1" bold>
        All Tab variants
      </Typography>
      <ul>
        <li>Active: Selected tab</li>
        <li>Inactive: Unselected tab</li>
        <li>Disabled: Disabled tab</li>
        <li>Min-width: Text-size + padding</li>
        <li>Widest-width: Widest tab decides width of other tabs</li>
        <li>Equal-width: Total width divided by number of tabs</li>
      </ul>

      <Typography>Active tab: {tabIndex}</Typography>

      <Tabs value={tabIndex} onChange={tabChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab>Tab three</Tab>
        </TabList>
        <TabPanels>
          <div>Panel one</div>
          <div>Panel two</div>
          <div>Panel three</div>
        </TabPanels>
      </Tabs>

      <Panel>
        <button onClick={() => setTabIndex(1)} type="button">
          Select tab 2
        </button>
      </Panel>
    </Wrapper>
  )
}
