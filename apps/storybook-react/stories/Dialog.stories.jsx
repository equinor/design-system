import React, { Fragment, useState } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Dialog, Button, Scrim, Typography } from '@equinor/eds-core-react'

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
  margin-bottom: 12px;
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
      <Button>Cancel</Button>
      <Button>OK</Button>
    </TempButtonWrapper>
  ),
}

export default {
  title: 'Components|Dialog',
  component: Dialog,
}

export const knobs = () => {
  const [visibleScrim, setVisibleScrim] = useState(false)
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
      <Typography variant="body_short">Top of page</Typography>
      <Typography variant="body_short">Center page.</Typography>
      <div>
        <Button onClick={() => setVisibleScrim(true)}>Trigger Dialog</Button>
      </div>
      <Typography variant="body_short">Bottom of page</Typography>
      <Scrim isVisible={visibleScrim}>
        <Dialog>
          <Title>{TITLE_CHOICES[titleChoice]}</Title>
          <CustomContent scrollable={contentChoice === 'scroll' ? true : false}>
            {CUSTOM_CONTENT_CHOICES[contentChoice]}
          </CustomContent>
          <Actions>
            {actionsChoice === 'buttons' ? (
              <TempButtonWrapper>
                <Button onClick={() => setVisibleScrim(false)}>Cancel</Button>
                <Button onClick={() => setVisibleScrim(false)}>OK</Button>
              </TempButtonWrapper>
            ) : (
              ACTION_CHOICES[actionsChoice]
            )}
          </Actions>
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
          <Actions>{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <Title>Placeholder + actions</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['empty']}</CustomContent>
          <Actions>{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <Title>Placeholder</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['emptyLarge']}</CustomContent>
          <Actions>{ACTION_CHOICES['none']}</Actions>
        </Dialog>
        <Dialog>
          <Title>Scrollable + actions</Title>
          <CustomContent scrollable>
            {CUSTOM_CONTENT_CHOICES['scroll']}
          </CustomContent>
          <Actions>{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
        <Dialog>
          <Title></Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES['description']}</CustomContent>
          <Actions>{ACTION_CHOICES['buttons']}</Actions>
        </Dialog>
      </BodyTypes>
    </Scrim>
  )
}

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
