import React, { useState, useEffect } from 'react'
import { StarProgress, StarProgressProps } from '@equinor/eds-core-react'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Components/Progress Indicators/Star',
  component: StarProgress,
} as Meta

export const Default: Story<StarProgressProps> = (args) => {
  const { value = 0, variant } = args
  let controllableValue: number | null
  variant === 'indeterminate'
    ? (controllableValue = null)
    : (controllableValue = value)
  const [progress, setProgress] = useState(controllableValue)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])
  return <StarProgress value={progress} {...args} />
}

export const Indeterminate: Story<StarProgressProps> = () => <StarProgress />

export const Determinate: Story<StarProgressProps> = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])
  return <StarProgress value={progress} variant="determinate" />
}

Default.storyName = 'Controllable example'
