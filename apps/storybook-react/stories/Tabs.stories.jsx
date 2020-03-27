import React, { useState, useEffect, createRef, useRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs, Typography } from '@equinor/eds-core-react'

const { TabList, Tab, TabPanels, TabPanel } = Tabs

const noop = () => {}

export default {
  title: 'Components|Tabs',
  component: Tabs,
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 24px;
`

export const tabStates = () => {
  const focusedRef = useRef(null)

  useEffect(() => {
    focusedRef.current.focus()
  }, [])

  return (
    <Wrapper>
      <Tabs activeTab={2} onChange={noop}>
        <TabList>
          <Tab>Enabled</Tab>
          <Tab disabled>Disabled</Tab>
          <Tab active>Active</Tab>
          <Tab data-hover>Hover</Tab>
          <Tab data-focus ref={focusedRef}>
            Focus
          </Tab>
        </TabList>
      </Tabs>
    </Wrapper>
  )
}

export const tabWidths = () => {
  return (
    <Wrapper>
      <Typography variant="h1">Tab widths</Typography>
      <Typography variant="h2">minWidth</Typography>
      <Tabs activeTab={1} onChange={noop} variant="minWidth">
        <TabList>
          <Tab>Text</Tab>
          <Tab>More text</Tab>
          <Tab>A really long line of text</Tab>
        </TabList>
      </Tabs>
      <Typography variant="h2">fullWidth</Typography>
      <Tabs activeTab={1} onChange={noop} variant="fullWidth">
        <TabList>
          <Tab>Text</Tab>
          <Tab>More text</Tab>
          <Tab>A really long line of text</Tab>
        </TabList>
      </Tabs>
    </Wrapper>
  )
}

export const tabPanels = () => {
  const [activeTab, setActiveTab] = useState(1)

  const handleChange = (event, index) => {
    setActiveTab(index)
  }

  return (
    <Wrapper>
      <Typography variant="h1">Tab with panels</Typography>
      <Typography variant="body_long">
        To navigate using they keyboard, use tab key to move from tab to tab
        panel, shift + tab to go backwards, use left and right arrow keys to
        move from between tabs (active tab must be focused). Focus outline is
        only visible when navigating using the keyboard.
      </Typography>
      <Tabs activeTab={activeTab} onChange={handleChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab disabled>Tab three</Tab>
          <Tab>Tab four</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel one</TabPanel>
          <TabPanel>Panel two</TabPanel>
          <TabPanel>Panel three</TabPanel>
          <TabPanel>Panel four</TabPanel>
        </TabPanels>
      </Tabs>
    </Wrapper>
  )
}
