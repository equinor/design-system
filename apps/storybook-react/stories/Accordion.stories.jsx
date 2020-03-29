import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { action } from '@storybook/addon-actions'
import { Accordion, Typography, Button, Icon } from '@equinor/eds-core-react'
import {
  attach_file,
  notifications,
  edit,
  delete_to_trash,
} from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'

const {
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} = Accordion

Icon.add({ attach_file, notifications, edit, delete_to_trash })

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

export const accordionsExample = () => {
  return (
    <Wrapper>
      <Typography>Accordion example</Typography>
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
        <AccordionItem isExpanded>
          <AccordionHeader>
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

      <Typography variant="h2">Disabled</Typography>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem disabled>
          <AccordionHeader>
            <AccordionButton>Header 1</AccordionButton>
          </AccordionHeader>
        </AccordionItem>
      </Accordion>

      <Typography variant="h2">Disabled expanded</Typography>

      <Accordion headerLevel="h3" chevronPosition="right">
        <AccordionItem disabled isExpanded>
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
                color="currentColor"
              />
              <Icon
                name="notifications"
                title="Notifications"
                size={16}
                color="currentColor"
              />
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
            <Button
              variant="ghost_icon"
              onClick={action('clicked edit button')}
            >
              <Icon name="edit" title="Edit" />
            </Button>
            <Button
              variant="ghost_icon"
              onClick={action('clicked delete button')}
            >
              <Icon name="delete_to_trash" title="Delete" />
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
