import React from 'react'
import styled from 'styled-components'
import { CircularProgress, CircularProgressProps, Button } from '@components'
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
  component: CircularProgress,
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

  return <CircularProgress {...args} value={progress} />
}

export const Indeterminate: Story<CircularProgressProps> = () => {
  return <CircularProgress />
}

export const Determinate: Story<CircularProgressProps> = () => {
  const progress = useProgress(0)
  return <CircularProgress variant="determinate" value={progress} />
}

export const Sizes: Story<CircularProgressProps> = () => (
  <Wrapper>
    <CircularProgress size={16} />
    <CircularProgress size={24} />
    <CircularProgress size={32} />
    <CircularProgress size={40} />
    <CircularProgress size={48} />
  </Wrapper>
)

export const InsideButton: Story<CircularProgressProps> = () => (
  <>
    <Button>
      <CircularProgress size={16} color="white" />
      Loading...
    </Button>
  </>
)

Default.storyName = 'Controllable example'
