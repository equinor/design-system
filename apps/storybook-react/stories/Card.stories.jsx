import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Card } from '@equinor/eds-core-react'

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

export default {
  title: 'Components|Card',
  component: Card,
}

export const Page = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <p>Top of page</p>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}
