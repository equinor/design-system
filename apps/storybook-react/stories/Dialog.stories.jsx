import React, { Fragment } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Dialog, Button } from '@equinor/eds-core-react'

import styled from 'styled-components'

const { Actions, Title, CustomContent } = Dialog

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: calc(100% - 64px);
  background: #ebebeb;
  display: grid;
  padding: 32px;
  grid-template-columns: 1fr 1fr 1fr;
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
`

const TITLE_CHOICES = {
  none: null,
  text: 'Title',
}

const CUSTOM_CONTENT_CHOICES = {
  none: null,
  empty: <Placeholder>Custom content</Placeholder>,
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
    <Wrapper>
      <Body>
        <p>Top of page</p>
        <Dialog>
          <Title>{TITLE_CHOICES[titleChoice]}</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES[contentChoice]}</CustomContent>
          <Actions tabIndex="0">{ACTION_CHOICES[actionsChoice]}</Actions>
        </Dialog>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}

export const types = () => {
  return (
    <Wrapper>
      <Body>
        {/* Text+actions
          Placeholder+actions
          Placeholder
          Scrollable placeholder + actions
          No title + text + actions */}
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
      </Body>
    </Wrapper>
  )
}

knobs.story = {
  name: 'With knobs',
  decorators: [withKnobs],
}
