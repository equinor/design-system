import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { Progress, StarProgressProps, Button } from '../../..'
import { ComponentMeta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'
import { Stack as SBStack } from './../../../../.storybook/components'
import page from './Star.docs.mdx'

const Stack = styled(SBStack)`
  padding: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Feedback/Progress Indicators/Star',
  component: Progress.Star,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Progress.Star>

export const Introduction: Story<StarProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return (
    <Stack>
      <Progress.Star value={progress} {...args} />
    </Stack>
  )
}

export const Indeterminate: Story<StarProgressProps> = () => (
  <Stack>
    <Progress.Star />
  </Stack>
)

export const Determinate: Story<StarProgressProps> = () => {
  const progress = useMockProgress(0)
  return (
    <Stack>
      <Progress.Star value={progress} variant="determinate" />{' '}
    </Stack>
  )
}

export const Sizes: Story<StarProgressProps> = () => (
  <Stack>
    <Progress.Star size={16} />
    <Progress.Star size={24} />
    <Progress.Star size={32} />
    <Progress.Star size={40} />
    <Progress.Star size={48} />
  </Stack>
)

export const Accessibility: Story<StarProgressProps> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && buttonRef.current && timer.current) {
      buttonRef.current.focus()
    }
  }, [isLoading])

  const resetProgress = () => {
    setIsLoading(true)
    timer.current = setTimeout(() => {
      setIsLoading(false)
    }, 6000)
  }
  return (
    <Stack aria-live="assertive">
      {isLoading ? (
        <Progress.Star size={48} aria-label="Loading star accessibility test" />
      ) : (
        <Button
          ref={buttonRef}
          onClick={resetProgress}
          aria-disabled={isLoading}
        >
          Click to load
        </Button>
      )}
    </Stack>
  )
}
