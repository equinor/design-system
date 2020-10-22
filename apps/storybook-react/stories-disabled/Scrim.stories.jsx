import React, { useState } from 'react'
import { Scrim, Button, Typography } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  height: calc(100vh - 64px);
  background: #ebebeb;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
`

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
}

export const Page = () => {
  const [visibleScrim, setVisibleScrim] = useState(false)
  const handleClose = (event, closed) => {
    if (closed) {
      setVisibleScrim(closed)
    } else {
      setVisibleScrim(!visibleScrim)
    }
  }

  return (
    <Body>
      <Typography variant="body_short">Top of page</Typography>
      <Typography variant="body_short">Center page.</Typography>
      <div>
        <Button onClick={() => setVisibleScrim(true)}>Trigger Scrim</Button>
      </div>
      <Typography variant="body_short">Bottom of page</Typography>
      {visibleScrim && (
        <Scrim onClose={handleClose} isDismissable>
          <TestContent>
            <Typography variant="body_short">
              Press close or hit “ESC” to close scrim.
            </Typography>
            <Button onClick={() => setVisibleScrim(false)}>OK</Button>
          </TestContent>
        </Scrim>
      )}
    </Body>
  )
}
