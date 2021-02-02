import React from 'react'
import styled from 'styled-components'
import {
  Progress,
  CircularProgressProps,
  Button,
  Typography,
} from '@components'
import { Meta, Story } from '@storybook/react'
import { useProgress } from './hooks/useProgress'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Components/Progress Indicators/Circular',
  component: Progress.Circular,
  parameters: {
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
  const progress = variant === 'indeterminate' ? null : useProgress(value)

  return <Progress.Circular {...args} value={progress} />
}

export const Indeterminate: Story<CircularProgressProps> = () => {
  return <Progress.Circular />
}

export const Determinate: Story<CircularProgressProps> = () => {
  const progress = useProgress(0)
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
  <>
    <Button>
      <Progress.Circular size={16} color="neutral" />
      Loading...
    </Button>
  </>
)

Default.storyName = 'Controllable example'
