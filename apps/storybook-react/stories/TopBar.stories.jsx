import React from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { TopBar, Icon, TextField } from '@equinor/eds-core-react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
} from '@equinor/eds-icons'

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
}

Icon.add(icons)

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  > * {
    margin-left: 40px;
  }
`

const TempSearchWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const TempSearch = styled(TextField)`
  width: 30%;
  min-width: 200px;
  input {
    border-bottom: none;
  }
  label {
    color: #fff;
  }
`

const LEFT_CHOICES = {
  none: null,
  icon: <Icon name="grid_on" size={16} />,
}

const CENTER_CHOICES = {
  none: null,
  search: (
    <TempSearchWrapper>
      <TempSearch
        id="topbar-test"
        type="search"
        title="search"
        placeholder="Replace with Search compoent"
      />
    </TempSearchWrapper>
  ),
  tabs: 'TODO: Use Tabs compoent',
  text: 'Some Center Text',
}

const RIGHT_CHOICES = {
  none: null,
  text: 'Some Right Text',
  icons: (
    <Icons>
      <Icon name="account_circle" size={16} title="user" />
      <Icon name="accessible" size={16} />
      <Icon name="notifications" size={16} />
      <Icon name="fullscreen" size={16} />
    </Icons>
  ),
}

export default {
  title: 'Components|TopBar',
  component: TopBar,
  decorators: [withKnobs],
}

export const Page = () => {
  const rightChoice = select('Right', Object.keys(RIGHT_CHOICES), 'icons')
  const leftChoice = select('Left', Object.keys(LEFT_CHOICES), 'none')
  const centerChoice = select('Center', Object.keys(CENTER_CHOICES), 'none')
  return (
    <Wrapper tabIndex="0">
      <TopBar
        title={text('Title', 'Application name - subtitle')}
        left={LEFT_CHOICES[leftChoice]}
        center={CENTER_CHOICES[centerChoice]}
        right={RIGHT_CHOICES[rightChoice]}
      />
      <Body>
        <p>Top of page</p>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}
