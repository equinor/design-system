import { useState, useEffect, useRef } from 'react'
import { Progress, CircularProgressProps, Button, Typography } from '../../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { useMockProgress } from '../../../stories'
import { Stack } from './../../../../.storybook/components'
import page from './Circular.docs.mdx'

const meta: Meta<typeof Progress.Circular> = {
  title: 'Feedback/Progress Indicators/Circular',
  component: Progress.Circular,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<CircularProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return <Progress.Circular {...args} value={progress} />
}
Introduction.decorators = [
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
]

export const Indeterminate: StoryFn<CircularProgressProps> = () => (
  <Progress.Circular />
)
Indeterminate.decorators = [
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
]

export const Determinate: StoryFn<CircularProgressProps> = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && buttonRef.current && timer.current) {
      buttonRef.current.focus()
    }
  }, [isLoading])

  const resetProgress = () => {
    setProgress(0)
    setIsLoading(true)
    timer.current = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === null) return null
        if (oldProgress === 100) {
          setIsLoading(false)
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 1500)
  }

  return (
    <div aria-busy={isLoading} aria-live="polite">
      {isLoading ? (
        <Progress.Circular
          id="progress-bar-circular"
          variant="determinate"
          aria-label="loading determinate progress test"
          value={progress}
        />
      ) : (
        <Button ref={buttonRef} onClick={resetProgress}>
          Trigger loader
        </Button>
      )}
    </div>
  )
}
Determinate.decorators = [
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
]

export const Colors: StoryFn<CircularProgressProps> = () => (
  <>
    <div>
      <Typography variant="h4" as="h2">
        Primary
      </Typography>
      <Progress.Circular color="primary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Neutral
      </Typography>
      <Progress.Circular color="neutral" />
    </div>
  </>
)
Colors.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          padding: '32px',
          backgroundColor: '#ebebeb',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Sizes: StoryFn<CircularProgressProps> = () => (
  <>
    <Progress.Circular size={16} />
    <Progress.Circular size={24} />
    <Progress.Circular size={32} />
    <Progress.Circular size={40} />
    <Progress.Circular size={48} />
  </>
)
Sizes.decorators = [
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
]

export const InsideButton: StoryFn<CircularProgressProps> = () => (
  <>
    <Button>
      <Progress.Circular size={16} color="neutral" />
      Loading...
    </Button>
    <Button variant="ghost_icon">
      <Progress.Circular size={24} />
    </Button>
  </>
)
InsideButton.storyName = 'Inside button'
InsideButton.decorators = [
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
]

export const Accessibility: StoryFn<CircularProgressProps> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const resetProgress = () => {
    setIsLoading(true)
    timer.current = setTimeout(() => {
      setIsLoading(false)
    }, 6000)
  }

  return (
    <div aria-busy={isLoading} aria-live="assertive">
      <Button onClick={resetProgress} aria-disabled={isLoading}>
        {isLoading ? (
          <>
            <Progress.Circular
              size={16}
              color="neutral"
              aria-label="Loading circular accessibility test"
            />
            <span aria-hidden="true">Loading...</span>
          </>
        ) : (
          <span>Click to load</span>
        )}
      </Button>
    </div>
  )
}
Accessibility.decorators = [
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
]
