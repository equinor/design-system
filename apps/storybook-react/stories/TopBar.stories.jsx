import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { TopBar } from '@equinor/eds-core-react'

const Wrapper = styled.div``

export default {
  title: 'Components|TopBar',
  component: TopBar,
  decorators: [withKnobs],
}

export const Default = () => (
  <div>
    <Wrapper>
      <TopBar title={text('Title', '')} />
    </Wrapper>
  </div>
)
