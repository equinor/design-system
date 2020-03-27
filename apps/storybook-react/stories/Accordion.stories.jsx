import React, { useState } from 'react'
import styled, { css } from 'styled-components'
// import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Accordion, Typography, Button, Icon } from '@equinor/eds-core-react'
import { attach_file, notifications } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'

const {
  AccordionItem,
  AccordionHeader,
  AccordionSummary,
  AccordionPanel,
} = Accordion

Icon.add({ attach_file, notifications })

export default {
  title: 'Components|Accordion',
  component: Accordion,
}

const Wrapper = styled.div`
  margin: 32px;

  & > h2 {
    margin-top: 0.5em;
  }
`

export const allAccordions = () => {
  return (
    <Wrapper>
      <Typography>All the Accordion</Typography>
      <Accordion>
        <AccordionItem isExpanded={true}>
          <AccordionHeader>
            <AccordionSummary>Header 1</AccordionSummary>
          </AccordionHeader>
          <AccordionPanel>Content 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionSummary>Header 1</AccordionSummary>
          </AccordionHeader>
          <AccordionPanel>Content 2</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionSummary>Header 1</AccordionSummary>
          </AccordionHeader>
          <AccordionPanel>Content 3</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Wrapper>
  )
}

const CustomContent = styled.div`
  display: grid;
  grid-auto-flow: row;
`

const addMarginRightProp = () => ({ marginRight }) =>
  marginRight && { marginRight: `${marginRight}px` }

const ButtonWithMarginProp = styled(Button)(addMarginRightProp)

const IconWithMarginProp = styled(Icon)(addMarginRightProp)

export const header = () => {
  return (
    <Wrapper>
      <Typography>Header variations</Typography>

      <Typography variant="h2">Chevron left</Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="left">
          <AccordionSummary>Header 1</AccordionSummary>
        </AccordionHeader>
      </Accordion>

      <Typography variant="h2">Chevron left expanded</Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="left" isExpanded>
          <AccordionSummary>Header 1</AccordionSummary>
        </AccordionHeader>
      </Accordion>

      <Typography variant="h2">Chevron right</Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="right">
          <AccordionSummary>Header 1</AccordionSummary>
        </AccordionHeader>
      </Accordion>

      <Typography variant="h2">Chevron left – custom icons right</Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="left">
          <AccordionSummary>Header 1</AccordionSummary>
          <IconWithMarginProp
            name="attach_file"
            title="Attach file"
            size={16}
            marginRight={32}
          />
          <Icon name="notifications" title="Notifications" size={16} />
        </AccordionHeader>
      </Accordion>

      <Typography variant="h2">
        Chevron left – interactive options right
      </Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="left">
          <AccordionSummary>Header 1</AccordionSummary>
          <Button variant="ghost_icon">
            <Icon name="attach_file" title="Attach file" />
          </Button>
          <ButtonWithMarginProp variant="ghost_icon" marginRight={-16}>
            <Icon name="notifications" title="Notifications" />
          </ButtonWithMarginProp>
        </AccordionHeader>
      </Accordion>

      <Typography variant="h2">Truncated text</Typography>

      <Accordion>
        <AccordionHeader variant="h3" chevronPosition="left">
          <AccordionSummary>
            Very long summary that will get truncated if the width of the header
            is narrower than the length of the text
          </AccordionSummary>
        </AccordionHeader>
      </Accordion>
    </Wrapper>
  )
}
