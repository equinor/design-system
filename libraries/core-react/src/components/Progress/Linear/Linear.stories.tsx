import { Progress, LinearProgressProps } from '../../..'
import { Meta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'

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
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return <Progress.Linear value={progress} {...args} />
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <Progress.Linear />
)

export const Determinate: Story<LinearProgressProps> = () => {
  const progress = useMockProgress(0)

  return <Progress.Linear variant="determinate" value={progress} />
}

Default.storyName = 'Controllable example'
