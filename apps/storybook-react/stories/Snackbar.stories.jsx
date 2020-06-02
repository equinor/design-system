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

export const Page = () => {
  const [open, setOpen] = useState(false)
  const [withActionOpen, setWithActionOpen] = useState(false)

  return (
    <Wrapper>
      <div>
        <Button type="button" onClick={() => setWithActionOpen(true)}>
          Show snackbar with action
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
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Show simple snackbar
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
    </Wrapper>
  )
}
