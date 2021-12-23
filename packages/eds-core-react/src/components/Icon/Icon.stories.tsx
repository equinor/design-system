import styled from 'styled-components'
import { Icon, IconProps } from '../..'
import { Story, Meta } from '@storybook/react'

import * as icons from '@equinor/eds-icons'

Icon.add(icons)

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

const customIconData = {
  name: 'moon',
  prefix: 'starwars',
  height: '24',
  width: '24',
  svgPathData:
    'M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z',
}

export default {
  title: 'Components/Icon',
  component: Icon,
  args: {
    name: 'save',
  },
  argTypes: {
    name: {
      options: Object.keys(icons),
      control: {
        type: 'select',
      },
    },
    color: {
      control: 'color',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `System icons enhance interfaces by adding visual communication
         to actions, status and feedback while reducing cognitive load. They are to
          provide meaning at a glance.
        `,
      },
    },
  },
} as Meta

export const Default: Story<IconProps> = (args) => <Icon {...args} />

export const Sizes: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="compare" size={16} />
    <Icon name="compare" size={24} />
    <Icon name="compare" size={32} />
    <Icon name="compare" size={40} />
    <Icon name="compare" size={48} />
  </Wrapper>
)
export const Rotations: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="pregnant_woman" rotation={90} />
    <Icon name="pregnant_woman" rotation={180} />
    <Icon name="pregnant_woman" rotation={270} />
  </Wrapper>
)
export const Accessible: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="grid_off" title="Save me!" />
  </Wrapper>
)
export const Color: Story<IconProps> = () => (
  <Wrapper>
    <Icon name="work" color={'red'} />
    <Icon name="work" color={'green'} />
    <Icon name="work" color={'blue'} />
  </Wrapper>
)
export const UsingDataPropWithEdsIcon: Story<IconProps> = () => (
  <Wrapper>
    <Icon data={icons.save} />
  </Wrapper>
)

UsingDataPropWithEdsIcon.storyName = 'Using data prop with EDS icon'

export const UsingDataPropWithCustomIcon: Story<IconProps> = () => (
  <Wrapper>
    <Icon title="Its a moon" data={customIconData} />
  </Wrapper>
)
UsingDataPropWithCustomIcon.storyName = 'Using data prop with custom icon'
