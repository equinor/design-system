import React, { useState, useEffect, createRef } from 'react'
import styled from 'styled-components'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Tabs1 as Tabs, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { typography } from '@equinor/eds-tokens/base/typography'
import { typographyTemplate } from '@equinor/eds-core-react/src/_common/templates'

const { Tab } = Tabs

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
  &:focus {
    outline: 2px solid orange;
  }
`

export const allTabs = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event, index) => {
    console.log('event:', event.currentTarget)
    setValue(index)
  }

  const Panel = (props) =>
    props.value === props.index && (
      <StyledPanel {...props}>{props.children}</StyledPanel>
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
        <Tab aria-controls="panel-three" id="tab-three">
          Tab three
        </Tab>
      </Tabs>
      <Panel
        id="panel-one"
        aria-labelledby="tab-one"
        role="tab-panel"
        tabIndex="0"
        value={value}
        index={0}
      >
        Panel one
      </Panel>
      <Panel
        id="panel-two"
        aria-labelledby="tab-two"
        role="tab-panel"
        tabIndex="0"
        value={value}
        index={1}
      >
        Panel two
      </Panel>
      <Panel
        id="panel-three"
        aria-labelledby="tab-three"
        role="tab-panel"
        tabIndex="0"
        value={value}
        index={2}
      >
        Panel three
      </Panel>
    </Wrapper>
  )
}
