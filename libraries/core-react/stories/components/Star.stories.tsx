import React from 'react'
import styled from 'styled-components'
import { StarProgress, StarProgressProps } from '@components'
import { Meta, Story } from '@storybook/react'
import { useProgress } from './hooks/useProgress'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

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

export const Sizes: Story<StarProgressProps> = () => (
  <Wrapper>
    <StarProgress size={16} />
    <StarProgress size={24} />
    <StarProgress size={32} />
    <StarProgress size={40} />
    <StarProgress size={48} />
  </Wrapper>
)

Default.storyName = 'Controllable example'
