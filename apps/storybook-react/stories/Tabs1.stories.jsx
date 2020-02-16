import React, { useState, useEffect, createRef, useRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs1 as Tabs, Typography } from '@equinor/eds-core-react'

const { Tab } = Tabs

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

  const a11yProps = (index) => ({
    id: `tab-${index + 1}`,
    'aria-controls': `panel-${index + 1}`,
  })

  const StyledPanel = styled.div`
    padding: 24px;
  `
  const Panel = ({ index, value, ...props }) => (
    <StyledPanel
      id={`panel-${index + 1}`}
      aria-labelledby={`tab-${index + 1}`}
      hidden={value !== index}
      role="tabpanel"
      tabIndex="0"
      {...props}
    >
      {props.children}
    </StyledPanel>
  )

  return (
    <Wrapper>
      <Tabs value={value} onChange={handleChange}>
        <Tab {...a11yProps(0)}>Tab one</Tab>
        <Tab {...a11yProps(1)}>Tab two</Tab>
        <Tab {...a11yProps(2)} disabled>
          Tab three
        </Tab>
        <Tab {...a11yProps(3)}>Tab four</Tab>
      </Tabs>
      <Panel value={value} index={0}>
        Panel one
      </Panel>
      <Panel value={value} index={1}>
        Panel two
      </Panel>
      <Panel value={value} index={2}>
        Panel three
      </Panel>
      <Panel value={value} index={3}>
        Panel four
      </Panel>
    </Wrapper>
  )
}
