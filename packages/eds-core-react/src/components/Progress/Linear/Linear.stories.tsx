import { Progress, LinearProgressProps } from '../../..'
import { Meta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'

export default {
  title: 'Feedback/Progress Indicators/Linear',
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
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return (
    <Progress.Linear
      value={progress}
      {...args}
      aria-label="Progress bar label"
    />
  )
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <Progress.Linear aria-label="Progress bar label" />
)

export const Determinate: Story<LinearProgressProps> = () => {
  const progress = useMockProgress(0)

  return (
    <Progress.Linear
      variant="determinate"
      value={progress}
      aria-label="Progress bar label"
    />
  )
}

Default.storyName = 'Controllable example'
