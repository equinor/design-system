import styled from 'styled-components'
import { Progress, CircularProgressProps, Button, Typography } from '../../..'
import { Meta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Feedback/Progress Indicators/Circular',
  component: Progress.Circular,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        component: `Progress indicators are animated helpers
        that indicate waiting time as content loads.
        `,
      },
    },
  },
} as Meta

export const Default: Story<CircularProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return <Progress.Circular {...args} value={progress} />
}

export const Indeterminate: Story<CircularProgressProps> = () => {
  return <Progress.Circular />
}

export const Determinate: Story<CircularProgressProps> = () => {
  const progress = useMockProgress(0)
  return <Progress.Circular variant="determinate" value={progress} />
}

export const Colors: Story<CircularProgressProps> = () => (
  <Wrapper>
    <div>
      <Typography variant="h4" as="h2">
        Primary
      </Typography>
      <Progress.Circular color="primary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Neutral
      </Typography>
      <Progress.Circular color="neutral" />
    </div>
  </Wrapper>
)

export const Sizes: Story<CircularProgressProps> = () => (
  <Wrapper>
    <Progress.Circular size={16} />
    <Progress.Circular size={24} />
    <Progress.Circular size={32} />
    <Progress.Circular size={40} />
    <Progress.Circular size={48} />
  </Wrapper>
)

export const InsideButton: Story<CircularProgressProps> = () => (
  <Wrapper>
    <Button>
      <Progress.Circular size={16} color="neutral" />
      Loading...
    </Button>
    <Button variant="ghost_icon">
      <Progress.Circular size={24} />
    </Button>
  </Wrapper>
)

Default.storyName = 'Controllable example'
