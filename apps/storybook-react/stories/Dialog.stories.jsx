import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Dialog, Button } from '@equinor/eds-core-react'

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
const TempContentWrapper = styled.div`
  display: block;
  height: 40px;
  margin-bottom: 16px;
  overflow-y: scroll;
`
const TempButtonWrapper = styled.div`
  /* margin: 16px; */
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: end;
`

const TITLE_CHOICES = {
  none: null,
  text: 'Title',
}

const CUSTOM_CONTENT_CHOICES = {
  none: null,
  description: <p>Small description here.</p>,
  scrollable: (
    <TempContentWrapper>
      <p>
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </p>
      <p>
        Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
        amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit lot.{' '}
      </p>
    </TempContentWrapper>
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
  decorators: [withKnobs],
}

export const Page = () => {
  const titleChoice = select('Title', Object.keys(TITLE_CHOICES), 'text')
  const contentChoice = select(
    'CustomContent',
    Object.keys(CUSTOM_CONTENT_CHOICES),
    'description',
  )
  const actionChoice = select('Actions', Object.keys(ACTION_CHOICES), 'none')
  return (
    <Wrapper tabIndex="0">
      <Body>
        <p>Top of page</p>
        <Dialog>
          <Title>{TITLE_CHOICES[titleChoice]}</Title>
          <CustomContent>{CUSTOM_CONTENT_CHOICES[contentChoice]}</CustomContent>
          <Actions>{ACTION_CHOICES[actionChoice]}</Actions>
        </Dialog>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}
