import React, { useState, useEffect, createRef } from 'react'
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

  const handleChange = (event, index) => {
    console.log('event:', event)
    setTabIndex(index)
  }

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

      <Tabs value={tabIndex} onChange={handleChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab disabled>Tab three</Tab>
        </TabList>
        <TabPanels>
          <div>Panel one</div>
          <div>Panel two</div>
          <div>Panel three</div>
        </TabPanels>
      </Tabs>

      <Panel>
        <button onClick={(event) => handleChange(event, 2)} type="button">
          Select tab 2
        </button>
      </Panel>
    </Wrapper>
  )
}

export const customPanels = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event, index) => {
    console.log('event:', event.currentTarget)
    setTabIndex(index)
  }

  const MyPanel = (props) =>
    props.value === props.index && <div>{props.children}</div>

  return (
    <Wrapper>
      <Tabs value={tabIndex} onChange={handleChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab>Tab three</Tab>
        </TabList>
      </Tabs>
      <MyPanel value={tabIndex} index={0}>
        Tab one
      </MyPanel>
      <MyPanel value={tabIndex} index={1}>
        Tab two
      </MyPanel>
      <MyPanel value={tabIndex} index={2}>
        Tab three
      </MyPanel>
    </Wrapper>
  )
}

export const focusedTab = () => {
  const focusedTab = createRef()

  useEffect(() => focusedTab.current.focus())

  return (
    <Tabs value={0}>
      <TabList>
        <Tab>Active tab</Tab>
        <Tab ref={focusedTab}>Focused tab</Tab>
        <Tab>Inactive tab</Tab>
      </TabList>
    </Tabs>
  )
}

export const tabStates = () => {}
