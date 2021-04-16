import React, { Fragment, useState } from 'react'
import { Dialog, DialogProps, Button, Scrim, Typography } from '@components'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: {
    Actions: Dialog.Actions,
    Title: Dialog.Title,
    CustomContent: Dialog.CustomContent,
  },
  parameters: {
    docs: {
      description: {
        component: `A basic dialog component.`,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: end;
  justify-self: end;
`

const Placeholder = styled.div`
  background: rgba(255, 146, 0, 0.15);
  border: 1px dashed #ff9200;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  display: inline-block;
`

export const Default: Story<DialogProps> = () => {
  //  Note: This example is not interactive, as Storybook
  // doesn't yet support to manipulate subcomponents via Storybook Args
  return (
    <Dialog>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.CustomContent>
        <Typography variant="body_short">Small description here.</Typography>
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Wrapper>
          <Button>OK</Button>
          <Button>Cancel</Button>
        </Wrapper>
      </Dialog.Actions>
    </Dialog>
  )
}
export const WithScrim: Story<DialogProps> = () => {
  const [visibleScrim, setVisibleScrim] = useState(false)
  const handleClose = () => {
    setVisibleScrim(!visibleScrim)
  }
  return (
    <>
      <div>
        <Button onClick={() => setVisibleScrim(true)}>Trigger Dialog</Button>
      </div>
      {visibleScrim && (
        <Scrim onClose={handleClose}>
          <Dialog>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.CustomContent scrollable>
              <Typography variant="body_short">
                Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor
                sit amet consecteur dit lot. Lorem ipsum dolor sit amet
                consecteur dit lot.
              </Typography>
              <Typography variant="body_short">
                Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor
                sit amet consecteur dit lot. Lorem ipsum dolor sit amet
                consecteur dit lot.
              </Typography>
            </Dialog.CustomContent>
            <Dialog.Actions>
              <Wrapper>
                <Button variant="ghost" onClick={() => setVisibleScrim(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setVisibleScrim(false)}>OK</Button>
              </Wrapper>
            </Dialog.Actions>
          </Dialog>
        </Scrim>
      )}
    </>
  )
}

export const TextPlusAction: Story<DialogProps> = () => (
  <Dialog>
    <Dialog.Title>Text + actions</Dialog.Title>
    <Dialog.CustomContent>
      <Typography variant="body_short">Small description here.</Typography>
    </Dialog.CustomContent>
    <Dialog.Actions>
      <Wrapper>
        <Button>OK</Button>
        <Button variant="ghost">Cancel</Button>
      </Wrapper>
    </Dialog.Actions>
  </Dialog>
)

export const PlaceholderPlusAction: Story<DialogProps> = () => (
  <Dialog>
    <Dialog.Title>Placeholder + actions</Dialog.Title>
    <Dialog.CustomContent>
      <Placeholder>Custom content</Placeholder>
    </Dialog.CustomContent>
    <Dialog.Actions>
      <Wrapper>
        <Button>OK</Button>
        <Button variant="ghost">Cancel</Button>
      </Wrapper>
    </Dialog.Actions>
  </Dialog>
)

export const PlaceholderOnly: Story<DialogProps> = () => (
  <Dialog>
    <Dialog.Title>Placeholder</Dialog.Title>
    <Dialog.CustomContent>
      <Placeholder>
        Custom content in a larger placeholder. No actions, only ESC or
        timedelay
      </Placeholder>
    </Dialog.CustomContent>
    <Dialog.Actions>
      <Wrapper>
        <Button>OK</Button>
        <Button variant="ghost">Cancel</Button>
      </Wrapper>
    </Dialog.Actions>
  </Dialog>
)

export const ScrollablePlusActions: Story<DialogProps> = () => (
  <Dialog>
    <Dialog.Title>Scrollable + actions</Dialog.Title>
    <Dialog.CustomContent scrollable>
      <Typography variant="body_short">
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.
      </Typography>
      <Typography variant="body_short">
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.
      </Typography>
    </Dialog.CustomContent>
    <Dialog.Actions>
      <Wrapper>
        <Button>OK</Button>
        <Button variant="ghost">Cancel</Button>
      </Wrapper>
    </Dialog.Actions>
  </Dialog>
)

export const NoTitle: Story<DialogProps> = () => (
  <Dialog>
    <Dialog.CustomContent>
      <Typography variant="body_short">Small description here.</Typography>
    </Dialog.CustomContent>
    <Dialog.Actions>
      <Wrapper>
        <Button>OK</Button>
        <Button variant="ghost">Cancel</Button>
      </Wrapper>
    </Dialog.Actions>
  </Dialog>
)
