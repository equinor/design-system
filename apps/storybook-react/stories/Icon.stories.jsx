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
    <h2>Using data prop with eds-icon</h2>
    <Wrapper>
      <Icon data={save} />
    </Wrapper>
    <h2>Using data prop with custom icon</h2>
    <Wrapper>
      <Icon
        title="Its a moon"
        data={{
          name: 'moon',
          prefix: 'starwars',
          height: '24',
          width: '24',
          svgPathData:
            'M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z',
        }}
      />
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
