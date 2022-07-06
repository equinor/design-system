import { useState, useEffect, useRef } from 'react'
import { Progress, DotProgressProps, Typography, Button } from '../../..'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack } from './../../../../.storybook/components'
import page from './Dots.docs.mdx'

export default {
  title: 'Feedback/Progress Indicators/Dots',
  component: Progress.Dots,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {},
} as ComponentMeta<typeof Progress.Dots>

export const Introduction: Story<DotProgressProps> = (args) => {
  return <Progress.Dots {...args} />
}
Introduction.bind({})
Introduction.args = {
  color: 'primary',
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

export const Colors: Story<DotProgressProps> = () => (
  <>
    <div>
      <Typography variant="h4" as="h2">
        Primary
      </Typography>
      <Progress.Dots color="primary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Tertiary
      </Typography>
      <Progress.Dots color="tertiary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Neutral
      </Typography>
      <Progress.Dots color="neutral" />
    </div>
  </>
)
Colors.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          padding: '32px',
          gridTemplateColumns: 'repeat(5, fit-content(100%))',
          backgroundColor: '#ebebeb',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Sizes: Story<DotProgressProps> = () => (
  <>
    <Progress.Dots color="primary" size={32} />
    <Progress.Dots color="primary" size={48} />
    <Progress.Dots color="primary" size={64} />
  </>
)
Sizes.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          padding: '32px',
          gridTemplateColumns: 'repeat(5, fit-content(100%))',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const InsideButton: Story<DotProgressProps> = () => (
  <>
    <Button>
      <Progress.Dots />
    </Button>
    <Button variant="ghost_icon">
      <Progress.Dots color="primary" />
    </Button>
  </>
)
InsideButton.decorators = [
  (Story) => {
    return (
      <Stack
        style={{
          padding: '32px',
          gridTemplateColumns: 'repeat(5, fit-content(100%))',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Accessibility: Story<DotProgressProps> = () => {
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
          <Progress.Dots
            id="progress-bar-dots-accessibility"
            aria-label="Loading dots accessibility test"
          />
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
          gridTemplateColumns: 'repeat(5, fit-content(100%))',
        }}
      >
        <Story />
      </Stack>
    )
  },
]
