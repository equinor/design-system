import React from 'react'
import { Progress, LinearProgressProps } from '@components'
import { Meta, Story } from '@storybook/react'
import { useProgress } from './hooks/useProgress'

export default {
  title: 'Components/Progress Indicators/Linear',
  component: Progress.Linear,
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

export const Default: Story<LinearProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = variant === 'indeterminate' ? null : useProgress(value)

  return <Progress.Linear value={progress} {...args} />
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <Progress.Linear />
)

export const Determinate: Story<LinearProgressProps> = () => {
  const progress = useProgress(0)

  return <Progress.Linear variant="determinate" value={progress} />
}

Default.storyName = 'Controllable example'
