import React from 'react'
import { Icon } from '@equinor/eds-core-react'
import styled from 'styled-components'
import {
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
} from '@equinor/eds-icons'

Icon.add({
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
})

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
`

export default {
  title: 'Components|Icon',
  component: Icon,
}

export const IconExample = () => (
  <Wrapper>
    <Icon name="layers_off" />
    <Icon name="pregnant_woman" rotation={270} />
    <Icon name="work" color="red" />
    <Icon name="accessible_forward" size={8} />
    <Icon name="grid_off" color="red" size={48} />
    <Icon name="compare" color="red" size={48} rotation={90} />
  </Wrapper>
)

// <LayersOff/>
// <Layers/>
