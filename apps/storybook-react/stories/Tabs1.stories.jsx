import React, { useState, useEffect, createRef, useRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs1 as Tabs, Typography } from '@equinor/eds-core-react'

const { Tab, tokens } = Tabs

const {
  states: {
    focused: {
      outline: {
        width: outlineWidth,
        style: outlineStyle,
        color: outlineColor,
      },
    },
  },
} = tokens

export default {
  title: 'Components|Tabs 1 (MUI Style)',
  component: Tabs,
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 24px;
`

const StyledPanel = styled.div`
  padding: 24px;
  &:focus {
    outline: ${outlineWidth} ${outlineStyle} ${outlineColor};
  }
`

export const tabStates = () => {
  const focusedRef = useRef(null)
  const noop = () => {}

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

export const allTabs = () => {
  const [value, setValue] = useState(1)

  const handleChange = (index) => {
    setValue(index)
  }

  const Panel = (props) => (
    <StyledPanel hidden={props.value !== props.index} {...props}>
      {props.children}
    </StyledPanel>
  )

  return (
    <Wrapper>
      <Tabs value={value} onChange={handleChange}>
        <Tab aria-controls="panel-one" id="tab-one">
          Tab one
        </Tab>
        <Tab aria-controls="panel-two" id="tab-two">
          Tab two
        </Tab>
        <Tab aria-controls="panel-three" id="tab-three" disabled>
          Tab three
        </Tab>
        <Tab aria-controls="panel-four" id="tab-four">
          Tab four
        </Tab>
      </Tabs>
      <Panel
        id="panel-one"
        aria-labelledby="tab-one"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={0}
      >
        Panel one
      </Panel>
      <Panel
        id="panel-two"
        aria-labelledby="tab-two"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={1}
      >
        Panel two
      </Panel>
      <Panel
        id="panel-three"
        aria-labelledby="tab-three"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={2}
      >
        Panel three
      </Panel>
      <Panel
        id="panel-four"
        aria-labelledby="tab-four"
        role="tab-panel"
        tabIndex="0"
        value={value}
        index={3}
      >
        Panel four
      </Panel>
    </Wrapper>
  )
}
