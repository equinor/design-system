import { Button, Scrim, ScrimProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { useArgs } from '@storybook/client-api'
import { Stack } from './../../../.storybook/components'
import page from './Scrim.docs.mdx'

export default {
  title: 'Feedback/Scrim',
  component: Scrim,
  args: {
    isDismissable: true,
    open: false,
  },
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
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Scrim>

export const Introduction: Story<ScrimProps> = (args) => {
  const { open } = args
  const [, updateArgs] = useArgs()

  const handleOpen = () => {
    updateArgs({ open: true })
  }

  const handleClose = () => {
    updateArgs({ open: false })
  }

  return (
    <>
      <Button onClick={handleOpen}>SHOW SCRIM</Button>
      <Scrim {...args} open={open} onClose={handleClose}>
        <Button onClick={handleClose}>HIDE SCRIM</Button>
      </Scrim>
    </>
  )
}
