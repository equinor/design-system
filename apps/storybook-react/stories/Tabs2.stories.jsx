import React, { useState, useEffect, createRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs2 as Tabs, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { typography } from '@equinor/eds-tokens/base/typography'
import { typographyTemplate } from '@equinor/eds-core-react/src/_common/templates'

const { TabList, TabPanels, TabPanel, Tab } = Tabs

export default {
  title: 'Components|Tabs 2 (Context)',
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

  const handleChange = (event, index) => {
    console.log('event:', event)
    setTabIndex(index)
  }

  return (
    <Wrapper>
      <Tabs value={tabIndex} onChange={handleChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab disabled>Tab three</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel one</TabPanel>
          <TabPanel>Panel two</TabPanel>
          <TabPanel>Panel three</TabPanel>
        </TabPanels>
      </Tabs>

      <Panel>
        <button onClick={(event) => handleChange(event, 1)} type="button">
          Select tab 2 from the outside
        </button>
      </Panel>
    </Wrapper>
  )
}
