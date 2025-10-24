import { Button, Scrim, ScrimProps, SideSheet } from '../..'
import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { Stack } from './../../../.storybook/components'
import page from './Scrim.docs.mdx'

const meta: Meta<typeof Scrim> = {
  title: 'Feedback/Scrim',
  component: Scrim,
  args: {
    isDismissable: true,
    open: false,
  },
  parameters: {
    docs: {
      autodocs: false,
      page,
      source: {
        excludeDecorators: true,
        type: 'code',
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
}

export default meta

export const Introduction: StoryFn<ScrimProps> = (args) => {
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

export const Dismissable: StoryFn<ScrimProps> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ minHeight: '30vh' }}>
      <Button onClick={() => setIsOpen(true)}>Open SideSheet</Button>
      <Scrim open={isOpen} onClose={() => setIsOpen(false)} isDismissable>
        <SideSheet open={isOpen} onClose={() => setIsOpen(false)}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora,
          esse labore. Asperiores tempore ex amet veniam consequatur dolorum
          perferendis, nihil non, culpa, modi sed nisi. Repellat, labore? Error,
          accusantium sed?
        </SideSheet>
      </Scrim>
    </div>
  )
}
