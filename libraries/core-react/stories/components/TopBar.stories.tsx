import React, { Fragment } from 'react'
import styled from 'styled-components'
import { TopBar, Icon, TextField, TopbarProps } from '@components'
import { Story, Meta } from '@storybook/react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
} from '@equinor/eds-icons'

const { Actions, Header, CustomContent } = TopBar

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
}

Icon.add(icons)

const Wrapper = styled.div.attrs({ tabIndex: 0 })`
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
  text: 'Application name - subtitle',
  'text+icon': (
    <Fragment>
      <Icon name="grid_on" size={16} />
      Application name - subtitle
    </Fragment>
  ),
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
  title: 'Components/TopBar',
  component: TopBar,
  subcomponents: { Actions, Header, CustomContent },
} as Meta

export const Basic: Story<TopbarProps> = (props): JSX.Element => {
  return (
    <Wrapper>
      <TopBar {...props}>
        <Header>{LEFT_CHOICES['text+icon']}</Header>
      </TopBar>
      <Body>
        <p>Top of page</p>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}

export const WithSearchAndIcons: Story<TopbarProps> = (): JSX.Element => (
  <Wrapper>
    <TopBar>
      <Header>{LEFT_CHOICES['text+icon']}</Header>
      <CustomContent>{CENTER_CHOICES.search}</CustomContent>
      <Actions>{RIGHT_CHOICES.icons}</Actions>
    </TopBar>
    <Body>
      <p>Top of page</p>
      <p>Middle of page</p>
      <p>Bottom of page</p>
    </Body>
  </Wrapper>
)
