import { useState, useEffect } from 'react'
import { Scrim, Button, Typography, ScrimProps } from '../..'
import { Story, Meta } from '@storybook/react'

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
  title: 'Components/Scrim',
  component: Scrim,
  args: {
    isDismissable: true,
    open: false,
  },
  parameters: {
    docs: {
      description: {
        component: `A scrim is a temporary visual effect that fades the general
        interface while allowing the user to focus on an overlay.
        `,
      },
    },
  },
} as Meta

export const Default: Story<ScrimProps> = (args) => {
  const { open } = args
  const [isOpen, setIsOpen] = useState(open)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  // This is just for storybook and changes done via controls addon
  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return (
    <>
      <Button onClick={handleOpen}>Trigger Scrim</Button>
      <Scrim {...args} open={isOpen} onClose={handleClose}>
        <TestContent>
          <Typography variant="body_short">
            Press close or hit “ESC” to close scrim.
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </TestContent>
      </Scrim>
    </>
  )
}
