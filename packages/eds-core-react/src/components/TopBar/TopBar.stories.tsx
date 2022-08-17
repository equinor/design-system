import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  TopBar,
  Icon,
  Search,
  TopbarProps,
  EdsProvider,
  Density,
  Typography,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import page from './TopBar.docs.mdx'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
} from '@equinor/eds-icons'

export default {
  title: 'Navigation/TopBar',
  component: TopBar,
  subcomponents: {
    Header: TopBar.Header,
    CustomContent: TopBar.CustomContent,
    Actions: TopBar.Actions,
  },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof TopBar>

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
}

Icon.add(icons)

const BodyWrapper = styled.div`
  height: 500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`

export const Introduction: Story<TopbarProps> = (props): JSX.Element => {
  return (
    <>
      <TopBar {...props}>
        <TopBar.Header>
          <>
            <Icon name="grid_on" size={16} />
            Application name - subtitle
          </>
        </TopBar.Header>
      </TopBar>
      <BodyWrapper>
        <Typography group="input" variant="text">
          Top of page
        </Typography>
        <Typography group="input" variant="text">
          Middle of page
        </Typography>
        <Typography group="input" variant="text">
          Bottom of page
        </Typography>
      </BodyWrapper>
    </>
  )
}

export const WithSearchAndIcons: Story<TopbarProps> = (): JSX.Element => {
  const Icons = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > * {
      margin-left: 40px;
    }
  `

  return (
    <TopBar>
      <TopBar.Header>
        <Icon name="grid_on" size={16} />
        Application name - subtitle
      </TopBar.Header>
      <TopBar.CustomContent>
        <Search aria-label="sitewide" id="search-normal" placeholder="Search" />
      </TopBar.CustomContent>
      <TopBar.Actions>
        <Icons>
          <Icon name="account_circle" size={16} title="user" />
          <Icon name="accessible" size={16} />
          <Icon name="notifications" size={16} />
          <Icon name="fullscreen" size={16} />
        </Icons>
      </TopBar.Actions>
    </TopBar>
  )
}
WithSearchAndIcons.storyName = 'With search and icons'

export const Compact: Story<TopbarProps> = (): JSX.Element => {
  const Icons = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > * {
      margin-left: 40px;
    }
  `
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <TopBar>
        <TopBar.Header>
          <Icon name="grid_on" size={16} />
          Application name - subtitle
        </TopBar.Header>
        <TopBar.CustomContent>
          <Search
            aria-label="sitewide"
            id="search-normal"
            placeholder="Search"
          />
        </TopBar.CustomContent>
        <TopBar.Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="accessible" size={16} />
            <Icon name="notifications" size={16} />
            <Icon name="fullscreen" size={16} />
          </Icons>
        </TopBar.Actions>
      </TopBar>
    </EdsProvider>
  )
}
