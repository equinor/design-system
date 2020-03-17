import React, { Fragment } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Dialog, Button, Scrim } from '@equinor/eds-core-react'

import styled from 'styled-components'

const { Actions, Title, CustomContent } = Dialog

const Body = styled.div`
  height: calc(100vh - 64px);
  background: #ebebeb;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
`

const BodyTypes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start;
  padding: 32px;
  grid-gap: 32px;
`

const TempButtonWrapper = styled.div`
  /* margin: 16px; */
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: end;
`

const Placeholder = styled.div`
  background: rgba(255, 146, 0, 0.15);
  border: 1px dashed #ff9200;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  height: calc(100% - 16px);
  margin-bottom: 8px;
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
  description: <p>Small description here.</p>,
  scroll: (
    <Fragment>
      <p>
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </p>
      <p>
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </p>
    </Fragment>
  ),
}

const ACTION_CHOICES = {
  none: null,
  buttons: (
    <TempButtonWrapper>
      <Button>Cancel</Button>
      <Button>OK</Button>
    </TempButtonWrapper>
  ),
}

let scrimVisible = false
const onTriggerModal = (event) => {
  if (scrimVisible === false) {
    scrimVisible = true
  } else {
    scrimVisible = false
  }
  console.log('Modal', scrimVisible)
}

export default {
  title: 'Components|Dialog',
  component: Dialog,
}

export const knobs = () => {
  const titleChoice = select('Title', [...Object.keys(TITLE_CHOICES)], 'text')
  const contentChoice = select(
    'CustomContent',
    [...Object.keys(CUSTOM_CONTENT_CHOICES)],
    'description',
  )
  const actionsChoice = select(
    'Actions',
    [...Object.keys(ACTION_CHOICES)],
    'buttons',
  )

  return (
    <Body>
      <p>Top of page</p>
      <p>
        Center page. <br />
        <br />
        <Button onClick={onTriggerModal}>Trigger Dialog</Button>
      </p>
      <p>Bottom of page</p>
      <Scrim isVisible={scrimVisible}>
        <Dialog>
          <Title>{TITLE_CHOICES[titleChoice]}</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES[contentChoice]}</CustomContent>
          <Actions tabIndex="0">{ACTION_CHOICES[actionsChoice]}</Actions>
        </Dialog>
      </Scrim>
    </Body>
  )
}

export const types = () => {
  return (
    <Scrim isVisible={true}>
      <BodyTypes>
        <Dialog>
          <Title>Text + actions</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
          <Actions tabIndex="0">{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <Title>Placeholder + actions</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['empty']}</CustomContent>
          <Actions tabIndex="1">{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <Title>Placeholder</Title>
          <CustomContent size="large">
            {CUSTOM_CONTENT_CHOICES['emptyLarge']}
          </CustomContent>
        </Dialog>
        <Dialog>
          <Title>Scrollable + actions</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['scroll']}</CustomContent>
          <Actions tabIndex="1">{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
          <Actions tabIndex="1">{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
      </BodyTypes>
    </Scrim>
  )
}

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
