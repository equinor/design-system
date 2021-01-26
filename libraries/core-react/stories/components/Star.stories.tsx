import React from 'react'
import { StarProgress, StarProgressProps } from '@components'
import { Meta, Story } from '@storybook/react'
import { useProgress } from './hooks/useProgress'

export default {
  title: 'Components/Progress Indicators/Star',
  component: StarProgress,
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
  const progress = variant === 'indeterminate' ? null : useProgress(value)

  return <StarProgress value={progress} {...args} />
}

export const Indeterminate: Story<StarProgressProps> = () => <StarProgress />

export const Determinate: Story<StarProgressProps> = () => {
  const progress = useProgress(0)
  return <StarProgress value={progress} variant="determinate" />
}

Default.storyName = 'Controllable example'
