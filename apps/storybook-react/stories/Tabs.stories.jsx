import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Tabs, Typography, Search } from '@equinor/eds-core-react'
import { action } from '@storybook/addon-actions'

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

  const handleChange = (index) => {
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

export const tabsAndSearch = () => {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const handleOnTextChange = (event) => {
    const value = event.target.value
    setSearchText(value)
  }
  const handleChange = (index) => {
    setActiveTab(index)
  }

  const handleFocus = (e) => {
    action('handleFocus')(e.target.textContent)
  }

  const handleBlur = (e) => {
    action('handleBlur')(e.target.textContent)
  }

  return (
    <div style={{ margin: '4rem' }}>
      <Search
        value={searchText}
        placeholder={'Search '}
        onChange={handleOnTextChange}
      />
      <Tabs
        style={{ marginTop: '2rem' }}
        activeTab={activeTab}
        onChange={handleChange}
        variant="fullWidth"
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <TabList>
          <Tab>Tags (5+)</Tab>
          <Tab> Docs (5+)</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel one</TabPanel>
          <TabPanel>Panel two</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export const tabsAndInputInPanel = () => {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const handleOnTextChange = (event) => {
    const value = event.target.value
    setSearchText(value)
  }
  const handleChange = (index) => {
    setActiveTab(index)
  }

  const handleFocus = (e) => {
    action('handleFocus')(e.target.textContent)
  }

  const handleBlur = (e) => {
    action('handleBlur')(e.target.textContent)
  }

  return (
    <div style={{ margin: '4rem' }}>
      <Tabs
        style={{ marginTop: '2rem' }}
        activeTab={activeTab}
        onChange={handleChange}
        variant="fullWidth"
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <TabList>
          <Tab>Tab with textfield</Tab>
          <Tab>Other tab</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ maxWidth: '20em' }}>
            <Typography variant="body_short" style={{ marginBottom: '1rem' }}>
              Panel one
            </Typography>
            <Search
              value={searchText}
              placeholder={'Search '}
              onChange={handleOnTextChange}
            />
          </TabPanel>
          <TabPanel>
            <Typography variant="body_short">Panel two</Typography>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}
