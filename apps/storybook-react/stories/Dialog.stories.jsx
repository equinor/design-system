import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import { Dialog, Button } from '@equinor/eds-core-react'

import styled from 'styled-components'
import { knobs } from './Divider.stories'

const { Actions, Title, CustomContent } = Dialog

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: 100%;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
`

const TITLE_CHOICES = {
  none: null,
  text: 'Title',
}

const CUSTOM_CONTENT_CHOICES = {
  none: null,
  description: <p>Small description here.</p>,
  placeholder: <Placeholder>Placeholder</Placeholder>,
  scrollable: (
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

export const Page = () => {
  const titleChoice = select('Title', Object.keys(TITLE_CHOICES), 'text')
  const contentChoice = select(
    'CustomContent',
    Object.keys(CUSTOM_CONTENT_CHOICES),
    'description',
  )
  const actionsChoice = select('Actions', Object.keys(ACTION_CHOICES), 'none')

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
  const textActionContent = select(
    'CustomContent',
    Object.keys(CUSTOM_CONTENT_CHOICES),
    'description',
  )
  const textActionActions = select(
    'Actions',
    Object.keys(ACTION_CHOICES),
    'buttons',
  )
  const placeholderActionContent = select(
    'CustomContent',
    Object.keys(CUSTOM_CONTENT_CHOICES),
    'placeholder',
  )
  const placeholderActionActions = select(
    'Actions',
    Object.keys(ACTION_CHOICES),
    'buttons',
  )

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
          <CustomContent>
            {CUSTOM_CONTENT_CHOICES[textActionContent]}
          </CustomContent>
          <Actions tabIndex="0">{ACTION_CHOICES[textActionActions]}</Actions>
        </Dialog>
        <Dialog>
          <Title>Placeholder + actions</Title>
          <CustomContent>
            {CUSTOM_CONTENT_CHOICES[placeholderActionContent]}
          </CustomContent>
          <Actions tabIndex="0">
            {ACTION_CHOICES[placeholderActionActions]}
          </Actions>
        </Dialog>
      </Body>
    </Wrapper>
  )
}
