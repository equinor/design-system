import React, { Fragment, useState } from 'react'
import {
  Dialog,
  DialogProps,
  Button,
  Scrim,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react/types-6-0'

const { Actions, Title, CustomContent } = Dialog

export default {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: { Actions, Title, CustomContent },
  parameters: {
    docs: {
      description: {
        component: `A basic dialog component`,
      },
    },
  },
} as Meta

const Body = styled.div`
  height: 200px;
  background: #ebebeb;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
  position: relative;
`

const TempButtonWrapper = styled.div`
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

const TITLE_CHOICES = {
  none: null,
  text: 'Title',
}

const CUSTOM_CONTENT_CHOICES = {
  none: null,
  empty: <Placeholder>Custom content</Placeholder>,
  emptyLarge: (
    <Placeholder>
      Custom content in a larger placeholder. No actions, only ESC or timedelay?
      Test testestsetsest
    </Placeholder>
  ),
  description: (
    <Typography variant="body_short">Small description here.</Typography>
  ),
  scroll: (
    <Fragment>
      <Typography variant="body_short">
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </Typography>
      <Typography variant="body_short">
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </Typography>
    </Fragment>
  ),
}

const ACTION_CHOICES = {
  none: null,
  buttons: (
    <TempButtonWrapper>
      <Button>OK</Button>
      <Button variant="ghost">Cancel</Button>
    </TempButtonWrapper>
  ),
}

export const Default: Story<DialogProps> = () => (
  <Dialog>
    <Title>{TITLE_CHOICES['text']}</Title>
    <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
    <Actions>
      <TempButtonWrapper>
        <Button>Cancel</Button>
        <Button>OK</Button>
      </TempButtonWrapper>
    </Actions>
  </Dialog>
)

export const WithScrim: Story<DialogProps> = () => {
  const [visibleScrim, setVisibleScrim] = useState(false)
  const handleClose = () => {
    setVisibleScrim(!visibleScrim)
  }
  return (
    <Body>
      <div>
        <Button onClick={() => setVisibleScrim(true)}>Trigger Dialog</Button>
      </div>
      {visibleScrim && (
        <Scrim onClose={handleClose}>
          <Dialog>
            <Title>{TITLE_CHOICES['text']}</Title>
            <CustomContent scrollable>
              {CUSTOM_CONTENT_CHOICES['scroll']}
            </CustomContent>
            <Actions>
              <TempButtonWrapper>
                <Button variant="ghost" onClick={() => setVisibleScrim(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setVisibleScrim(false)}>OK</Button>
              </TempButtonWrapper>
            </Actions>
          </Dialog>
        </Scrim>
      )}
    </Body>
  )
}

export const TextPlusAction: Story<DialogProps> = () => (
  <Dialog>
    <Title>Text + actions</Title>
    <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
    <Actions>{ACTION_CHOICES['buttons']}</Actions>
  </Dialog>
)

export const PlaceholderPlusAction: Story<DialogProps> = () => (
  <Dialog>
    <Title>Placeholder + actions</Title>
    <CustomContent>{CUSTOM_CONTENT_CHOICES['empty']}</CustomContent>
    <Actions>{ACTION_CHOICES['buttons']}</Actions>
  </Dialog>
)

export const PlaceholderOnly: Story<DialogProps> = () => (
  <Dialog>
    <Title>Placeholder</Title>
    <CustomContent>{CUSTOM_CONTENT_CHOICES['emptyLarge']}</CustomContent>
    <Actions>{ACTION_CHOICES['none']}</Actions>
  </Dialog>
)

export const ScrollablePlusActions: Story<DialogProps> = () => (
  <Dialog>
    <Title>Scrollable + actions</Title>
    <CustomContent scrollable>{CUSTOM_CONTENT_CHOICES['scroll']}</CustomContent>
    <Actions>{ACTION_CHOICES['buttons']}</Actions>
  </Dialog>
)

export const NoTitle: Story<DialogProps> = () => (
  <Dialog>
    <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
    <Actions>{ACTION_CHOICES['buttons']}</Actions>
  </Dialog>
)
