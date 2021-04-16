import React, { useState } from 'react'
import { Scrim, Button, Typography, ScrimProps } from '@components'
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
  const [visibleScrim, setVisibleScrim] = useState(false)
  const handleClose = (event, closed) => {
    if (closed) {
      setVisibleScrim(closed)
    } else {
      setVisibleScrim(!visibleScrim)
    }
  }

  return (
    <>
      <Button onClick={() => setVisibleScrim(true)}>Trigger Scrim</Button>
      {visibleScrim && (
        <Scrim {...args} onClose={handleClose}>
          <TestContent>
            <Typography variant="body_short">
              Press close or hit “ESC” to close scrim.
            </Typography>
            <Button onClick={() => setVisibleScrim(false)}>Close</Button>
          </TestContent>
        </Scrim>
      )}
    </>
  )
}
