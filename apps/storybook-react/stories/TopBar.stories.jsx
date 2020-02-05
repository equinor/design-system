import React from 'react'
import {
  withKnobs,
  select,
  text,
  boolean,
  object,
} from '@storybook/addon-knobs'
import styled from 'styled-components'
import { TopBar, Icon, TextField, Button } from '@equinor/eds-core-react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
  // todo
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
  save,
} from '@equinor/eds-icons'

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
  // todo
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
  save,
}

Icon.add(icons)

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Gradient = styled.div`
  height: 2000px;
  background-image: linear-gradient(
    to bottom,
    #d16ba5,
    #c777b9,
    #ba83ca,
    #aa8fd8,
    #9a9ae1,
    #8aa7ec,
    #79b3f4,
    #69bff8,
    #52cffe,
    #41dfff,
    #46eefa,
    #5ffbf1
  );
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
        position={select('Position', ['fixed', 'sticky', 'static'], 'fixed')}
      />
      <Gradient>Top of page</Gradient>
    </Wrapper>
  )
}
