import { useState, useEffect, useRef } from 'react'
import { Progress, StarProgressProps, Button } from '../../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { useMockProgress } from '../../../stories'
import { Stack } from './../../../../.storybook/components'
import page from './Star.docs.mdx'

const meta: Meta<typeof Progress.Star> = {
  title: 'Feedback/Progress Indicators/Star',
  component: Progress.Star,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack
          style={{
            padding: '32px',
          }}
        >
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<StarProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return <Progress.Star value={progress} {...args} />
}

export const Indeterminate: StoryFn<StarProgressProps> = () => <Progress.Star />

export const Determinate: StoryFn<StarProgressProps> = () => {
  const progress = useMockProgress(0)
  return <Progress.Star value={progress} variant="determinate" />
}

export const Sizes: StoryFn<StarProgressProps> = () => (
  <>
    <Progress.Star size={16} />
    <Progress.Star size={24} />
    <Progress.Star size={32} />
    <Progress.Star size={40} />
    <Progress.Star size={48} />
  </>
)

export const Accessibility: StoryFn<StarProgressProps> = () => {
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
    <div aria-live="assertive">
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
    </div>
  )
}
