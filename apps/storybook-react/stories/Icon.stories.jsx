import React from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Icon } from '@equinor/eds-core-react'
import {
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
  save,
  info_circle,
  list,
  filter_alt,
} from '@equinor/eds-icons'

const icons = {
  layers,
  layers_off,
  grid_off,
  compare,
  work,
  pregnant_woman,
  accessible_forward,
  save,
  info_circle,
  list,
  filter_alt,
}

Icon.add(icons)

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Components/Icon',
  component: Icon,
  decorators: [withKnobs],
}

export const IconExamples = () => (
  <div>
    <h2>Sizes</h2>
    <Wrapper>
      <Icon name="compare" size={16} />
      <Icon name="compare" size={24} />
      <Icon name="compare" size={32} />
      <Icon name="compare" size={40} />
      <Icon name="compare" size={48} />
    </Wrapper>
    <h2>Rotations</h2>

    <Wrapper>
      <Icon name="pregnant_woman" rotation={90} />
      <Icon name="pregnant_woman" rotation={180} />
      <Icon name="pregnant_woman" rotation={270} />
    </Wrapper>
    <h2>Color</h2>
    <Wrapper>
      <Icon name="work" color={'red'} />
      <Icon name="work" color={'green'} />
      <Icon name="work" color={'blue'} />
    </Wrapper>
    <h2>Accessible</h2>
    <Wrapper>
      <Icon name="grid_off" title="Save me!" />
    </Wrapper>
    <h2>With knobs</h2>
    <Wrapper>
      <Icon
        name={select('Name', Object.keys(icons), 'save')}
        size={select('Sizes', [16, 24, 32, 40, 48], 24)}
        rotation={select('Rotation', [0, 90, 180, 270], 0)}
        color={text('Color', '#000eb7')}
        title={text('Title', '')}
      />
    </Wrapper>
  </div>
)
