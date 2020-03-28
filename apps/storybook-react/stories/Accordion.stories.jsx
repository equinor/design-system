import React, { useState } from 'react'
import styled, { css } from 'styled-components'
// import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Accordion, Typography, Button, Icon } from '@equinor/eds-core-react'
import { attach_file, notifications } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'

const {
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} = Accordion

Icon.add({ attach_file, notifications })

const Wrapper = styled.div`
  margin: 32px;

  & > h2 {
    margin-top: 0.5em;
  }
`

const addMarginRightProp = () => ({ marginRight }) =>
  marginRight && { marginRight: `${marginRight}px` }

const IconWithMarginProp = styled(Icon)(addMarginRightProp)

export default {
  title: 'Components|Accordion',
  component: Accordion,
}

export const allAccordions = () => {
  return (
    <Wrapper>
      <Typography>All the Accordion</Typography>
      <Accordion>
        <AccordionItem isExpanded>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
          <AccordionPanel>Content 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
          <AccordionPanel>Content 2</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
          <AccordionPanel>Content 3</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Wrapper>
  )
}

export const header = () => {
  return (
    <Wrapper>
      <Typography>Header variations</Typography>

      <Typography variant="h2">Chevron left</Typography>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">Chevron left expanded</Typography>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader isExpanded>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">Chevron right</Typography>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">Chevron left – custom icons right</Typography>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>
              Header 1
              <IconWithMarginProp
                name="attach_file"
                title="Attach file"
                size={16}
                marginRight={32}
              />
              <Icon name="notifications" title="Notifications" size={16} />
            </AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">
        Chevron left – interactive options right
      </Typography>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
            <Button variant="ghost_icon">
              <Icon name="attach_file" title="Attach file" />
            </Button>
            <Button variant="ghost_icon">
              <Icon name="notifications" title="Notifications" />
            </Button>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">Truncated text</Typography>

      <Accordion headerLevel="h3" chevronPosition="left">
        <AccordionItem>
          <AccordionHeader>
            <AccordionButton>
              Very long summary that will get truncated if the width of the
              header is narrower than the length of the text
            </AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>
    </Wrapper>
  )
}
