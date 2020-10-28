import React, { useState, useEffect } from 'react'
import { LinearProgress, LinearProgressProps } from '@equinor/eds-core-react'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Components/Progress Indicators/Linear',
  component: LinearProgress,
} as Meta

export const Default: Story<LinearProgressProps> = (args) => {
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
  return <LinearProgress {...args} value={progress} />
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <LinearProgress />
)

export const Determinate: Story<LinearProgressProps> = () => {
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
  return <LinearProgress variant="determinate" value={progress} />
}

Default.storyName = 'Controllable example'
