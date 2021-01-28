import React from 'react'
import { CircularProgress, CircularProgressProps } from '@components'
import { Meta, Story } from '@storybook/react'
import { useProgress } from './hooks/useProgress'

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

Default.storyName = 'Controllable example'
