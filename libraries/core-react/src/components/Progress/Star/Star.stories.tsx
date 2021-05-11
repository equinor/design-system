import styled from 'styled-components'
import { Progress, StarProgressProps } from '../../..'
import { Meta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Components/Progress Indicators/Star',
  component: Progress.Star,
  parameters: {
    docs: {
      description: {
        component: `Progress indicators are animated helpers that indicate
        waiting time as content loads.
        `,
      },
    },
  },
} as Meta

export const Default: Story<StarProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return <Progress.Star value={progress} {...args} />
}

export const Indeterminate: Story<StarProgressProps> = () => <Progress.Star />

export const Determinate: Story<StarProgressProps> = () => {
  const progress = useMockProgress(0)
  return <Progress.Star value={progress} variant="determinate" />
}

export const Sizes: Story<StarProgressProps> = () => (
  <Wrapper>
    <Progress.Star size={16} />
    <Progress.Star size={24} />
    <Progress.Star size={32} />
    <Progress.Star size={40} />
    <Progress.Star size={48} />
  </Wrapper>
)

Default.storyName = 'Controllable example'
