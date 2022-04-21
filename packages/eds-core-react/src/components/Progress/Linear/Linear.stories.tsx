import { Progress, LinearProgressProps } from '../../..'
import { ComponentMeta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'
import styled from 'styled-components'
import { Stack as SBStack } from './../../../../.storybook/components'
import page from './Linear.docs.mdx'

export default {
  title: 'Feedback/Progress Indicators/Linear',
  component: Progress.Linear,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Progress.Linear>

const Stack = styled(SBStack)`
  padding: 32px;
`

export const Introduction: Story<LinearProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return (
    <Stack>
      <Progress.Linear
        value={progress}
        {...args}
        aria-label="Progress bar label"
      />
    </Stack>
  )
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <Stack>
    <Progress.Linear aria-label="Progress bar label" />
  </Stack>
)

export const Determinate: Story<LinearProgressProps> = () => {
  const progress = useMockProgress(0)

  return (
    <Stack>
      <Progress.Linear
        variant="determinate"
        value={progress}
        aria-label="Progress bar label"
      />
    </Stack>
  )
}
