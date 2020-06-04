import React, { Fragment, useState } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Snackbar, Button, Typography } from '@equinor/eds-core-react'

const { SnackbarAction } = Snackbar
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px 0;
  padding-bottom: 8rem;
  grid-gap: 2rem;
`

export default {
  title: 'Components|Snackbar',
  component: Snackbar,
}

export const Example = () => {
  const [open, setOpen] = useState(false)
  const [withActionOpen, setWithActionOpen] = useState(false)

  return (
    <Wrapper>
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Show a simple snackbar for 5 seconds
        </Button>
        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          autoHideDuration={5000}
          centerAlignFrom="1000px"
        >
          Message goes here
        </Snackbar>
      </div>
      <div>
        <Button type="button" onClick={() => setWithActionOpen(true)}>
          Show a snackbar with action for the default 7 seconds
        </Button>
        <Snackbar
          open={withActionOpen}
          onClose={() => setWithActionOpen(false)}
        >
          Your changes was saved
          <SnackbarAction>
            <Button variant="ghost">Undo</Button>
          </SnackbarAction>
        </Snackbar>
      </div>
    </Wrapper>
  )
}

const autoHideDurationOptions = {
  Five: 5000,
  Six: 6000,
  Seven: 7000,
  Eight: 8000,
  Nine: 9000,
  Ten: 10000,
}

const actionOptions = {
  none: null,
  undoButton: 'button',
}

export const knobs = () => {
  const [open, setOpen] = useState(false)
  const message = text('Message', 'Message goes here')
  const duration = select('Duration in seconds', autoHideDurationOptions)
  const action = select('Action', actionOptions)

  return (
    <Wrapper>
      <div>
        <Button onClick={() => setOpen(true)}>Trigger snackbar</Button>
      </div>
      {open && (
        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          autoHideDuration={duration}
        >
          {message}
          {action}
          {action && (
            <SnackbarAction>
              <Button variant="ghost">Undo</Button>
            </SnackbarAction>
          )}
        </Snackbar>
      )}
    </Wrapper>
  )
}

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
