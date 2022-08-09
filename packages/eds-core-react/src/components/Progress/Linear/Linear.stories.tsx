import { Progress, LinearProgressProps, Button } from '../../..'
import { useState, useEffect, useRef } from 'react'
import { ComponentMeta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'
import { Stack } from './../../../../.storybook/components'
import page from './Linear.docs.mdx'

export default {
  title: 'Feedback/Progress Indicators/Linear',
  component: Progress.Linear,
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
            gridTemplateColumns: 'repeat(5, fit-content(100%)',
          }}
        >
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Progress.Linear>

export const Introduction: Story<LinearProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return (
    <>
      <Progress.Linear
        value={progress}
        {...args}
        aria-label="Progress bar label"
      />
    </>
  )
}

export const Indeterminate: Story<LinearProgressProps> = () => (
  <>
    <Progress.Linear aria-label="Progress bar label" />
  </>
)

export const Determinate: Story<LinearProgressProps> = () => {
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
        <Progress.Linear
          variant="determinate"
          aria-label="loading determinate linear progress test"
          value={progress}
        />
      ) : (
        <Button ref={buttonRef} onClick={resetProgress}>
          Trigger progress
        </Button>
      )}
    </div>
  )
}

export const Accessibility: Story<LinearProgressProps> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
    <div aria-live="assertive">
      {isLoading ? (
        <Progress.Linear aria-label="Loading linear accessibility test" />
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
