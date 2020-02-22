import React, { useState, useEffect, createRef, useRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs, Typography } from '@equinor/eds-core-react'

const { Tab, Panel } = Tabs

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
      <Tabs value={2} onChange={noop}>
        <Tab>Enabled</Tab>
        <Tab disabled>Disabled</Tab>
        <Tab active>Active</Tab>
        <Tab data-hover>Hover</Tab>
        <Tab data-focus ref={focusedRef}>
          Focus
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export const tabWidths = () => {
  return (
    <Wrapper>
      <Typography variant="h1">Tab widths</Typography>
      <Typography variant="h2">minWidth</Typography>
      <Tabs value={1} onChange={noop} variant="minWidth">
        <Tab>Text</Tab>
        <Tab>More text</Tab>
        <Tab>A really long line of text</Tab>
      </Tabs>
      <Typography variant="h2">fullWidth</Typography>
      <Tabs value={1} onChange={noop} variant="fullWidth">
        <Tab>Text</Tab>
        <Tab>More text</Tab>
        <Tab>A really long line of text</Tab>
      </Tabs>
    </Wrapper>
  )
}

export const tabPanels = () => {
  const [value, setValue] = useState(1)

  const handleChange = (index) => {
    setValue(index)
  }

  const tabA11yProps = (index) => ({
    id: `tab-${index + 1}`,
    'aria-controls': `panel-${index + 1}`,
  })

  const panelA11yProps = (index) => ({
    index,
    id: `panel-${index + 1}`,
    'aria-labelledby': `tab-${index + 1}`,
  })

  return (
    <Wrapper>
      <Typography variant="h1">Tab with panels</Typography>
      <Typography variant="body_long">
        To navigate using they keyboard, use tab key to move from tab to tab
        panel, shift + tab to go backwards, use left and right arrow keys to
        move from between tabs (active tab must be focused). Focus outline is
        only visible when navigating using the keyboard.
      </Typography>
      <Tabs value={value} onChange={handleChange}>
        <Tab {...tabA11yProps(0)}>Tab one</Tab>
        <Tab {...tabA11yProps(1)}>Tab two</Tab>
        <Tab {...tabA11yProps(2)} disabled>
          Tab three
        </Tab>
        <Tab {...tabA11yProps(3)}>Tab four</Tab>
      </Tabs>
      <Panel {...panelA11yProps(0)} value={value}>
        Panel one
      </Panel>
      <Panel {...panelA11yProps(1)} value={value}>
        Panel two
      </Panel>
      <Panel {...panelA11yProps(2)} value={value}>
        Panel three
      </Panel>
      <Panel {...panelA11yProps(3)} value={value}>
        Panel four
      </Panel>
    </Wrapper>
  )
}
