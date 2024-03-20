import { Button, Scrim, ScrimProps, Dialog, Typography } from '../..'
import { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import styled from 'styled-components'
import { useArgs } from '@storybook/preview-api'
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

const Wrapper = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(2, auto);
  justify-content: end;
  justify-self: end;
`

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

//This story used to be imported from Dialog.stories.tsx, but there is currently an issue with importing stories from other places into mdx
//see https://github.com/storybookjs/storybook/issues/22451
export const Dismissable: StoryFn<ScrimProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen} isDismissable onClose={handleClose}>
        <Dialog.Header>
          <Dialog.Title>Dismissable dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant="body_short">
            Closes dialog on click outside and escape key.
          </Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
