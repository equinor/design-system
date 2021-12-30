import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { TopBar, Icon, Search, TopbarProps, EdsProvider, Density } from '../..'
import { Story, Meta } from '@storybook/react'

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
    Actions: TopBar.Actions,
    Header: TopBar.Header,
    CustomContent: TopBar.CustomContent,
  },
  parameters: {
    docs: {
      description: {
        component: `The top bar displays navigation
        and actions relating to the interface.
        `,
      },
    },
  },
} as Meta

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

const BodyWrapper = styled.div`
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const Basic: Story<TopbarProps> = (props): JSX.Element => {
  return (
    <Wrapper>
      <TopBar {...props}>
        <TopBar.Header>
          <>
            <Icon name="grid_on" size={16} />
            Application name - subtitle
          </>
        </TopBar.Header>
      </TopBar>
      <BodyWrapper>
        <p>Top of page</p>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </BodyWrapper>
    </Wrapper>
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

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `TopBar` using `EdsProvider` ',
    },
  },
}
