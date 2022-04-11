import { Scrim, Button, Typography, ScrimProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { useArgs } from '@storybook/client-api'
import { Stack } from './../../../.storybook/components'
import page from './Scrim.docs.mdx'

import styled from 'styled-components'

const TestContent = styled.div`
  background: rgba(255, 146, 0, 0.5);
  border: 1px dashed #ff9200;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  height: calc(250px - 16px);
  margin-bottom: 12px;
  width: 350px;
`

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
    },
  },
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
    <Stack>
      <Button onClick={handleOpen}>Trigger Scrim</Button>
      <Scrim {...args} open={open} onClose={handleClose}>
        <TestContent>
          <Typography variant="body_short">
            Press close or hit “ESC” to close scrim.
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </TestContent>
      </Scrim>
    </Stack>
  )
}
